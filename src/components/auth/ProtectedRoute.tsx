'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';

import { useAuth } from '@/components/auth/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Use useLayoutEffect on client to prevent flash
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Simple subscription for mount state - avoids setState in effect
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Track if we're on the client (mounted)
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Redirect unauthenticated users
  useIsomorphicLayoutEffect(() => {
    if (mounted && !isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // Always show loading until we've confirmed authentication
  // This prevents any flash of protected content
  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">
            {!mounted || isLoading ? 'Loading...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
