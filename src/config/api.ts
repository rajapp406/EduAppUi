// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3900',
  ENDPOINTS: {
    ONBOARDING: '/user-profiles/onboarding',
    SCHOOLS_SEARCH: '/schools',
    LOCATIONS_SEARCH: '/locations/search',
    CITIES: '/locations/cities',
    QUIZ_ATTEMPT: '/quiz-attempts',
    QUIZZES: '/quizzes',
  },
  USER_ID: '0016e789-b406-46a5-bf04-0cca30fea38e',
  TIMEOUT: 30000, // 30 seconds
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  // Get auth token from localStorage
  const authData = localStorage.getItem('persist:root');
  let token = '';
  
  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      const authState = JSON.parse(parsedData.auth);
      token = authState.user?.accessToken || '';
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};