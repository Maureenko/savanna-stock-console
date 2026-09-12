import { PackageSearch } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = 'No items found',
  message = 'Try adjusting your search or filter criteria.',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <PackageSearch className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-muted-foreground">{message}</p>
      {onReset && (
        <Button onClick={onReset} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
