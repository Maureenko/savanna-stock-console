import { describe, it, expect, beforeEach, vi } from 'vitest';

import { authStore } from './auth-store';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('authStore', () => {
  beforeEach(() => {
    authStore.clear();
    localStorageMock.store = {};
    vi.clearAllMocks();
  });

  describe('setTokens', () => {
    it('should store access and refresh tokens', () => {
      authStore.setTokens('access123', 'refresh456');

      expect(authStore.getAccessToken()).toBe('access123');
      expect(authStore.getRefreshToken()).toBe('refresh456');
    });

    it('should persist refresh token to localStorage', () => {
      authStore.setTokens('access123', 'refresh456');

      expect(localStorageMock.setItem).toHaveBeenCalledWith('clinic_refresh_token', 'refresh456');
    });
  });

  describe('clear', () => {
    it('should remove all tokens', () => {
      authStore.setTokens('access123', 'refresh456');
      authStore.clear();

      expect(authStore.getAccessToken()).toBeNull();
      expect(authStore.getRefreshToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(authStore.isAuthenticated()).toBe(false);
    });

    it('should return true when token exists', () => {
      authStore.setTokens('access123', 'refresh456');
      expect(authStore.isAuthenticated()).toBe(true);
    });
  });

  describe('setUser and getUser', () => {
    it('should store and retrieve user', () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/avatar.jpg',
      };

      authStore.setUser(user);
      expect(authStore.getUser()).toEqual(user);
    });
  });
});
