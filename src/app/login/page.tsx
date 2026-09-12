'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth, LoginForm } from '@/components/auth';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to items if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/items');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Clinic Stock Console</h1>
        <p className="mt-2 text-muted-foreground">Internal inventory management system</p>
      </div>
      <LoginForm />
    </main>
  );
}
