import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
      <h3 className="mb-2 text-lg font-semibold">Error Loading Data</h3>
      <p className="mb-4 text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
