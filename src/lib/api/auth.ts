import axios from 'axios';

import { authStore } from '@/lib/auth-store';
import apiClient from '@/lib/axios';
import type { LoginCredentials, LoginResponse, RefreshResponse, User } from '@/types/auth';

const BASE_URL = 'https://dummyjson.com';

/**
 * Login user and get tokens
 * Uses short token expiry (1 min) for testing as per requirements
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Use plain axios for login, not the apiClient (which adds auth headers)
  const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: credentials.expiresInMins ?? 1, // Default to 1 min for testing
  });

  const { accessToken, refreshToken, ...user } = response.data;

  // Store tokens and user
  authStore.setTokens(accessToken, refreshToken);
  authStore.setUser(user);

  return user;
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (token: string): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(`${BASE_URL}/auth/refresh`, {
    refreshToken: token,
    expiresInMins: 1, // Short expiry for testing
  });

  return response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Logout user - clears all stored auth data
 */
export const logout = (): void => {
  authStore.clear();
};
