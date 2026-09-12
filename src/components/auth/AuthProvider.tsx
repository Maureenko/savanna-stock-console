'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getCurrentUser, login as apiLogin, logout as apiLogout } from '@/lib/api/auth';
import { authStore } from '@/lib/auth-store';
import { setAuthFailureHandler } from '@/lib/axios';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    router.push('/login');
  }, [router]);

  // Set up auth failure handler for axios interceptors
  useEffect(() => {
    setAuthFailureHandler(logout);
  }, [logout]);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = authStore.getRefreshToken();
      const storedUser = authStore.getUser();

      if (refreshToken) {
        try {
          // We have a refresh token, try to get current user
          // This will trigger token refresh if needed via axios interceptors
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          authStore.setUser(currentUser);
        } catch {
          // Failed to restore session, clear everything
          authStore.clear();
          setUser(null);
        }
      } else if (storedUser) {
        // No refresh token but have stored user - clear stale data
        authStore.clear();
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const loggedInUser = await apiLogin({ username, password });
      setUser(loggedInUser);
      router.push('/items');
    },
    [router]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
