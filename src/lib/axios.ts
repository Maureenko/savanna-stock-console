import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

import { authStore } from '@/lib/auth-store';
import type { RefreshResponse } from '@/types/auth';

const BASE_URL = 'https://dummyjson.com';

// Token expiry buffer - refresh if token expires within this many seconds
const TOKEN_EXPIRY_BUFFER_SECONDS = 30;

// Track if we're currently refreshing to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Callback for handling auth failure (set by AuthProvider)
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (handler: () => void): void => {
  onAuthFailure = handler;
};

// Add subscribers that will be notified when token refresh completes
const subscribeTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers with new token
const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Check if JWT token is expired or about to expire
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + TOKEN_EXPIRY_BUFFER_SECONDS;
  } catch {
    // If we can't decode, assume it's expired
    return true;
  }
};

// Refresh the access token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = authStore.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<RefreshResponse>(`${BASE_URL}/auth/refresh`, {
    refreshToken,
    expiresInMins: 1, // Short expiry for testing as per requirements
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  authStore.setTokens(accessToken, newRefreshToken);

  return accessToken;
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token and handle proactive refresh
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth for login and refresh endpoints
    const isAuthEndpoint =
      config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh');

    if (isAuthEndpoint) {
      return config;
    }

    let accessToken = authStore.getAccessToken();

    // If we have a token and it's expired/expiring, proactively refresh
    if (accessToken && isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          accessToken = await refreshAccessToken();
          onTokenRefreshed(accessToken);
        } catch (error) {
          // Refresh failed, clear auth and let the request fail
          authStore.clear();
          isRefreshing = false;
          throw error;
        }
        isRefreshing = false;
      } else {
        // Another refresh is in progress, wait for it
        accessToken = await new Promise<string>((resolve) => {
          subscribeTokenRefresh((token) => {
            resolve(token);
          });
        });
      }
    }

    // Attach token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If we get a 401 and haven't retried yet, try to refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Skip retry for auth endpoints
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          onTokenRefreshed(newToken);
          isRefreshing = false;

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          authStore.clear();

          // Call the auth failure handler (set by AuthProvider for proper routing)
          if (onAuthFailure) {
            onAuthFailure();
          }

          return Promise.reject(refreshError);
        }
      } else {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
