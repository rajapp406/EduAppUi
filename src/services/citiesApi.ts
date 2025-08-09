import { City } from '@/models/user';
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config/api';

export class CitiesApiService {
  /**
   * Fetch all cities from the API
   */
  static async getCities(): Promise<City[]> {
    try {
      const response = await fetch(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.CITIES)}?includeRelations=false`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cities = await response.json();
      
      // Sort cities alphabetically by name
      return cities.sort((a: City, b: City) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Cities API error:', error);
      throw error;
    }
  }

  /**
   * Search cities by name
   */
  static async searchCities(query: string): Promise<City[]> {
    try {
      const allCities = await this.getCities();
      
      // Filter cities based on the search query
      return allCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('City search error:', error);
      return [];
    }
  }

  /**
   * Get city by ID
   */
  static async getCityById(cityId: string): Promise<City | null> {
    try {
      const allCities = await this.getCities();
      return allCities.find(city => city.id === cityId) || null;
    } catch (error) {
      console.error('Get city by ID error:', error);
      return null;
    }
  }
}