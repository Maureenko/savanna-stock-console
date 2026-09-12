/**
 * Simple auth store for managing tokens
 * Tokens are stored in memory for security (accessToken)
 * and localStorage for persistence (refreshToken)
 */

import type { User } from '@/types/auth';

const REFRESH_TOKEN_KEY = 'clinic_refresh_token';
const USER_KEY = 'clinic_user';

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

// In-memory store for access token (more secure than localStorage)
const store: AuthStore = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const authStore = {
  getAccessToken: (): string | null => store.accessToken,

  getRefreshToken: (): string | null => {
    if (store.refreshToken) return store.refreshToken;
    // Try to restore from localStorage on first access
    if (typeof window !== 'undefined') {
      store.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return store.refreshToken;
  },

  getUser: (): User | null => {
    if (store.user) return store.user;
    // Try to restore from localStorage on first access
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          store.user = JSON.parse(userStr);
        } catch {
          // Invalid JSON, clear it
          localStorage.removeItem(USER_KEY);
        }
      }
    }
    return store.user;
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    store.accessToken = accessToken;
    store.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  setUser: (user: User): void => {
    store.user = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clear: (): void => {
    store.accessToken = null;
    store.refreshToken = null;
    store.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    return !!(store.accessToken || authStore.getRefreshToken());
  },
};
