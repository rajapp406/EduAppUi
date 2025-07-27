import { api } from './api';
import { store } from '../store/store';
import { login, logout, setLoading, socialLogin } from '../store/slices/authSlice';
import { storage } from '../utils/storage';

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
        user: any; // Replace 'any' with your User type if available
      }
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      store.dispatch(login({ ...user, accessToken, refreshToken }));
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
  public static async register(userData: RegisterData) {
    try {
      store.dispatch(setLoading(true));
      interface RegisterResponse {
        accessToken: string;
        refreshToken: string;
        user: any; // Replace 'any' with your User type if available
      }
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      
      store.dispatch(login({
        ...response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
      
      return response.data;
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
      store.dispatch(setLoading(true));
      
      interface GoogleUser {
        id: string;
        name: string;
        email: string;
        avatar?: string;
      }
      
      interface GoogleLoginResponse {
        accessToken: string;
        refreshToken: string;
        user: GoogleUser;
      }
      const response = {data: {
        "id": "9e9eeb10-f65d-4a1b-b1ca-c4688fb51217",
        "firstName": "Raj",
        "lastName": "B",
        "email": "raj.lh404@gmail.com",
        "isActive": true,
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTllZWIxMC1mNjVkLTRhMWItYjFjYS1jNDY4OGZiNTEyMTciLCJlbWFpbCI6InJhai5saDQwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTM2MjA3NDMsImV4cCI6MTc1MzYyMTY0M30.rJLGUkaTkSM_HXJ2GYhGFzQCpE0xOm6mb1BED_sfUNA",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTllZWIxMC1mNjVkLTRhMWItYjFjYS1jNDY4OGZiNTEyMTciLCJlbWFpbCI6InJhai5saDQwNEBnbWFpbC5jb20iLCJpYXQiOjE3NTM2MjA3NDMsImV4cCI6MTc1NDIyNTU0M30.MLmm6bxGUvY9mgbrJGHykn0mMhn9HGnmA1cMDMquy5w",
        "profile": null
    }}
    storage.setAuthData({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: {
        id: response.data.id,
        name: response.data.firstName + ' ' + response.data.lastName,
        email: response.data.email,
        provider: 'google' as const,
      },
    });
     // const response = await api.post<GoogleLoginResponse>('/auth/googleAuth', { idToken: googleToken });
      const { accessToken, refreshToken, id, firstName, lastName, email } = response.data;
      
      store.dispatch(socialLogin({ 
        id,
        name: firstName + ' ' + lastName, 
        email, 
        accessToken, 
        refreshToken, 
        provider: 'google' as const 
      }));
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
