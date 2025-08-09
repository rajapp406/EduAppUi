import {
  OnboardingData,
  OnboardingApiPayload,
  UserProfile,
} from "@/models/user";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "@/config/api";

export class OnboardingApiService {
  private static transformOnboardingData(
    data: OnboardingData,
    userId: string
  ): OnboardingApiPayload {
    return {
      userId,
      userType: "STUDENT",
      // TODO: Map school name to schoolId via school lookup API
      schoolId: data.schoolId, // Will be resolved by backend or separate lookup
      cityId: data.cityId,
      grade: data.grade,
      board: data.board,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : undefined,
      phoneNumber: data.phoneNumber,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      interests: data.interests || [],
    };
  }

  static async submitOnboarding(
    data: OnboardingData,
    userId: string
  ): Promise<UserProfile> {
    try {
      // Validate required fields
      const missingFields = [];
      if (!data.grade) missingFields.push('grade');
      if (!data.board) missingFields.push('board');
      if (!data.schoolId?.trim()) missingFields.push('schoolId');
      if (!data.cityId?.trim()) missingFields.push('cityId');
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required onboarding information: ${missingFields.join(', ')}`);
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const payload = this.transformOnboardingData(data, userId);

      console.log("Original onboarding data:", data);
      console.log("Transformed API payload:", payload);

      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.ONBOARDING),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Transform API response to UserProfile format
      return {
        id: result.id || userId,
        name: result.name || "",
        email: result.email || "",
        avatar: result.avatar,
        grade: result.grade,
        board: result.board,
        schoolId: result.schoolId || data.schoolId,
        cityId: result.location?.id || data.cityId,
        cityName: result.location?.name,
        dateOfBirth: result.dateOfBirth,
        phoneNumber: result.phoneNumber,
        parentEmail: result.parentEmail,
        parentPhone: result.parentPhone,
        interests: result.interests || [],
        isOnboardingComplete: true,
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Onboarding API error:", error);
      throw error;
    }
  }

  // Helper method to lookup schools (if needed)
  static async searchSchools(
    query: string = ''
  ): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch(
        `${buildApiUrl(
          API_CONFIG.ENDPOINTS.SCHOOLS_SEARCH
        )}?q=${encodeURIComponent(query)}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("School search error:", error);
      return [];
    }
  }

  // Helper method to lookup locations (if needed)
  static async searchLocations(
    query: string
  ): Promise<
    Array<{ id: string; city: string; state: string; country: string }>
  > {
    try {
      const response = await fetch(
        `${buildApiUrl(
          API_CONFIG.ENDPOINTS.LOCATIONS_SEARCH
        )}?q=${encodeURIComponent(query)}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Location search error:", error);
      return [];
    }
  }
}
