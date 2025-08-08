import { api } from './api';
import { store } from '../store/store';
import { login, logout, setLoading } from '../store/slices/authSlice';
import { storage } from '../utils/storage';
import type { User } from '../store/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  // Add any additional registration fields here
}

export class AuthService {
  /**
   * Login with email and password
   */
  public static async login(email: string, password: string): Promise<void> {
    try {
      store.dispatch(setLoading(true));
      
      interface LoginResponse {
        accessToken: string;
        refreshToken: string;
        user: Omit<User, 'accessToken' | 'refreshToken'>;
      }
      
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      store.dispatch(login({ 
        ...user, 
        accessToken, 
        refreshToken 
      }));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Register a new user
   */
  public static async register(userData: RegisterData): Promise<{ user: Omit<User, 'accessToken' | 'refreshToken'>; accessToken: string; refreshToken: string }> {
    try {
      store.dispatch(setLoading(true));
      
      interface RegisterResponse {
        accessToken: string;
        refreshToken: string;
        user: Omit<User, 'accessToken' | 'refreshToken'>;
      }
      
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      
      store.dispatch(login({
        ...response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      }));
      
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Login with Google
   */
  public static async loginWithGoogle(googleToken: string): Promise<void> {
    try {
      console.log('Starting Google login with token:', googleToken);
      store.dispatch(setLoading(true));
      
      // In a real app, you would make an API call to your backend to verify the Google token
      // For now, we'll simulate a successful response
      console.log('Simulating Google login...');
      const response = {
        data: {
          id: '9e9eeb10-f65d-4a1b-b1ca-c4688fb51217',
          firstName: 'Raj',
          lastName: 'B',
          name: 'Raj B',
          email: 'raj.lh404@gmail.com',
          isActive: true,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTllZWIxMC1mNjVkLTRhMWItYjFjYS1jNDY4OGZiNTEyMTciLCJlbWFpbCI6InJhai5saDQwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTM2MjA3NDMsImV4cCI6MTc1MzYyMTY0M30.rJLGUkaTkSM_HXJ2GYhGFzQCpE0xOm6mb1BED_sfUNA',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTllZWIxMC1mNjVkLTRhMWItYjFjYS1jNDY4OGZiNTEyMTciLCJlbWFpbCI6InJhai5saDQwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTM2MjA3NDMsImV4cCI6MTc1NDIyNTU0M30.MLmm6bxGUvY9mgbrJGHykn0mMhn9HGnmA1cMDMquy5w',
          profile: null
        }
      };
      
      console.log('Google login response:', response.data);
      
      // Prepare user data
      const userData = {
        id: response.data.id,
        name: response.data.name || `${response.data.firstName} ${response.data.lastName}`.trim(),
        email: response.data.email,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        provider: 'google' as const,
      };
      
      // Save to storage
      storage.setAuthData({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: {
          id: response.data.id,
          name: userData.name,
          email: response.data.email,
          provider: 'google' as const,
        },
      });
      
      console.log('Auth data saved to storage, dispatching login action...');
      
      // Dispatch the login action to update the Redux store
      store.dispatch(login(userData));
      console.log('Login action dispatched, user should be redirected...');
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Logout the current user
   */
  public static async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      store.dispatch(logout());
    }
  }

  /**
   * Get current user's profile
   */
  public static async getCurrentUser<T = unknown>(): Promise<T> {
    try {
      const response = await api.get<{ user: T }>('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  public static isAuthenticated(): boolean {
    const { isAuthenticated, user } = store.getState().auth;
    return isAuthenticated && !!user?.accessToken;
  }

  /**
   * Get access token
   */
  public static getAccessToken(): string | undefined {
    return store.getState().auth.user?.accessToken;
  }
}

export default AuthService;
