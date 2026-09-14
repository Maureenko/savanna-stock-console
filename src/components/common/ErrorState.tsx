import { AlertCircle, FileQuestion, Home, RefreshCw, WifiOff } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function getErrorDetails(message: string) {
  // Check for 404 errors
  if (message.includes('404') || message.toLowerCase().includes('not found')) {
    return {
      icon: FileQuestion,
      title: 'Item Not Found',
      description: "The item you're looking for doesn't exist or may have been removed.",
      showRetry: false,
      showHomeLink: true,
    };
  }

  // Check for network errors
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
    return {
      icon: WifiOff,
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      showRetry: true,
      showHomeLink: false,
    };
  }

  // Default error
  return {
    icon: AlertCircle,
    title: 'Error Loading Data',
    description: message,
    showRetry: true,
    showHomeLink: false,
  };
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const { icon: Icon, title, description, showRetry, showHomeLink } = getErrorDetails(message);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
    >
      <Icon className="mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-md text-muted-foreground">{description}</p>
      <div className="flex gap-3">
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        {showHomeLink && (
          <Link href="/items">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to Items
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
