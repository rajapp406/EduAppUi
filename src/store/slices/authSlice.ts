import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

// Load initial state from localStorage if available
const loadInitialState = () => {
  const authData = storage.getAuthData();
  if (authData) {
    return {
      isAuthenticated: true,
      isLoading: false,
      user: {
        ...authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      },
    };
  }
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
  };
};

type ProviderType = 'email' | 'google' | 'facebook' | 'github';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: ProviderType;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

const initialState: AuthState = loadInitialState();

// Thunk to check authentication status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    try {
      const authData = storage.getAuthData();
      if (authData && authData.accessToken) {
        // Here you would typically validate the token with your backend
        // For now, we'll just return the stored user data
        return {
          isAuthenticated: true,
          user: {
            id: authData.user.id,
            name: authData.user.name,
            email: authData.user.email,
            avatar: authData.user.avatar,
            provider: authData.user.provider,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
          },
        };
      }
      throw new Error('No valid session found');
    } catch (error) {
      storage.clearAuthData();
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      });
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state, action: PayloadAction<AuthState['user']>) => {
      if (!action.payload) return;
      
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      
      // Save auth data to localStorage
      storage.setAuthData({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          avatar: action.payload.avatar,
          provider: action.payload.provider,
        },
      });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      
      // Clear auth data from localStorage
      storage.clearAuthData();
    },
    socialLogin: (state, action: PayloadAction<{
      id: string;
      name: string;
      email: string;
      avatar?: string;
      accessToken: string;
      refreshToken: string;
      provider: ProviderType;
    }>) => {
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
      };
      state.isLoading = false;
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      if (state.user) {
        state.user.accessToken = action.payload.accessToken;
        state.user.refreshToken = action.payload.refreshToken;
        
        // Update tokens in localStorage
        storage.updateTokens({
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        });
      }
    },
  },
});

export const { login, logout, socialLogin, setLoading, updateTokens } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export default authSlice.reducer;