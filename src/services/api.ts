import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

// Use NEXT_PUBLIC_ prefix for client-side environment variables in Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3100';

class ApiService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: 'API_BASE_URL',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.user?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        // If error is not 401, reject with error
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // If we get a 401 and we're already trying to refresh, reject
        if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Add request to the queue
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Try to refresh the token
        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          const refreshToken = store.getState().auth.user?.refreshToken;
          if (!refreshToken) {
            store.dispatch(logout());
            return Promise.reject(error);
          }

          // Call your refresh token endpoint
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          
          // Update the store with new tokens
          store.dispatch({
            type: 'auth/updateTokens',
            payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
          });

          // Update the original request header
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          // Process the queue
          this.processQueue(null, data.accessToken);

          // Retry the original request
          return this.instance(originalRequest);
        } catch (refreshError) {
          const error = refreshError as AxiosError;
          this.processQueue(error);
          store.dispatch(logout());
          return Promise.reject(error);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  private processQueue(error: any | null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        // Create a proper AxiosError if it's not already one
        const axiosError: AxiosError = axios.isAxiosError(error) 
          ? error 
          : new Error(error?.message || 'An unknown error occurred') as AxiosError;
        promise.reject(axiosError);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public get = <T>(url: string, config?: AxiosRequestConfig) => 
    this.instance.get<T>(url, config);

  public post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    this.instance.post<T>(url, data, config);

  public put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    this.instance.put<T>(url, data, config);

  public delete = <T>(url: string, config?: AxiosRequestConfig) =>
    this.instance.delete<T>(url, config);

  public patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    this.instance.patch<T>(url, data, config);
}

export const api = new ApiService();
