const AUTH_STORAGE_KEY = 'auth_data';

type ProviderType = 'email' | 'google' | 'facebook' | 'github';

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: ProviderType;
  joinDate?: string;
  [key: string]: any; // For any additional user properties
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export const storage = {
  // Get complete auth data (tokens + user)
  getAuthData: (): AuthData | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  // Set complete auth data
  setAuthData: (data: { accessToken: string; refreshToken: string; user: UserData }): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    }
  },
  
  // Clear all auth data
  clearAuthData: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },
  
  // Get just the access token
  getAccessToken: (): string | null => {
    const data = storage.getAuthData();
    return data?.accessToken || null;
  },
  
  // Get just the refresh token
  getRefreshToken: (): string | null => {
    const data = storage.getAuthData();
    return data?.refreshToken || null;
  },
  
  // Get user data
  getUser: (): UserData | null => {
    const data = storage.getAuthData();
    return data?.user || null;
  },
  
  // Update user data
  updateUser: (userData: Partial<UserData>): void => {
    const currentData = storage.getAuthData();
    if (currentData) {
      storage.setAuthData({
        ...currentData,
        user: {
          ...currentData.user,
          ...userData
        }
      });
    }
  },
  
  // Update tokens
  updateTokens: (tokens: { accessToken: string; refreshToken: string }): void => {
    const currentData = storage.getAuthData();
    if (currentData) {
      storage.setAuthData({
        ...currentData,
        ...tokens
      });
    }
  }
};
