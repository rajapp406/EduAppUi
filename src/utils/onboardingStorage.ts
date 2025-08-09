import { OnboardingData } from '@/models/user';

const ONBOARDING_STORAGE_KEY = 'onboarding_data';
const ONBOARDING_STEP_KEY = 'onboarding_current_step';

export class OnboardingStorage {
  /**
   * Save onboarding data to localStorage
   */
  static saveData(data: Partial<OnboardingData>): void {
    try {
      const existingData = this.getData();
      const mergedData = { ...existingData, ...data };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(mergedData));
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error);
    }
  }

  /**
   * Get onboarding data from localStorage
   */
  static getData(): Partial<OnboardingData> {
    try {
      const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading onboarding data from localStorage:', error);
      return {};
    }
  }

  /**
   * Save current step to localStorage
   */
  static saveCurrentStep(step: number): void {
    try {
      localStorage.setItem(ONBOARDING_STEP_KEY, step.toString());
    } catch (error) {
      console.error('Error saving current step to localStorage:', error);
    }
  }

  /**
   * Get current step from localStorage
   */
  static getCurrentStep(): number {
    try {
      const step = localStorage.getItem(ONBOARDING_STEP_KEY);
      return step ? parseInt(step, 10) : 1;
    } catch (error) {
      console.error('Error reading current step from localStorage:', error);
      return 1;
    }
  }

  /**
   * Clear all onboarding data from localStorage
   */
  static clearData(): void {
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_STEP_KEY);
    } catch (error) {
      console.error('Error clearing onboarding data from localStorage:', error);
    }
  }

  /**
   * Check if there's existing onboarding data
   */
  static hasData(): boolean {
    try {
      const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return data !== null && data !== '{}';
    } catch (error) {
      console.error('Error checking onboarding data in localStorage:', error);
      return false;
    }
  }

  /**
   * Get a summary of what data is available
   */
  static getDataSummary(): {
    hasBasicInfo: boolean;
    hasAcademicInfo: boolean;
    hasContactInfo: boolean;
    hasInterests: boolean;
  } {
    const data = this.getData();
    
    return {
      hasBasicInfo: !!(data.grade && data.board),
      hasAcademicInfo: !!(data.school && data.cityId),
      hasContactInfo: !!(data.dateOfBirth || data.phoneNumber || data.parentEmail || data.parentPhone),
      hasInterests: !!(data.interests && data.interests.length > 0)
    };
  }
}