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
    <main className="relative min-h-screen min-h-dvh w-full overflow-hidden">
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
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20" />

      {/* Content container */}
      <div className="relative z-10 flex min-h-screen min-h-dvh items-center justify-center p-4 sm:p-6 lg:items-start lg:justify-end lg:p-16 lg:pt-20">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Login Form Card */}
          <div className="rounded-xl bg-white/95 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="mb-5 flex flex-col items-center text-center sm:mb-6">
              <div className="relative mb-1 h-20 w-40 sm:h-24 sm:w-48">
                <Image
                  src="/logo.png"
                  alt="StockCare Logo"
                  fill
                  className="object-contain"
                  sizes="192px"
                  priority
                />
              </div>
              <p className="text-sm text-gray-600">Sign in to access your inventory</p>
            </div>

            <LoginForm />

            <p className="mt-5 text-center text-xs text-gray-500 sm:mt-6">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
