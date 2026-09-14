'use client';

import Image from 'next/image';
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/PillsLogin.webp"
        alt="Medical supplies background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content container - positioned to align form to top right */}
      <div className="relative z-10 flex min-h-screen items-start justify-end p-4 pt-8 sm:p-8 sm:pt-12 md:p-12 md:pt-16 lg:p-16 lg:pt-20">
        <div className="w-full max-w-md">
          {/* Login Form Card */}
          <div className="rounded-xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-600">Sign in to access your inventory</p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
