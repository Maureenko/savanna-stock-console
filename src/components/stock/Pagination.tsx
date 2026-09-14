'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useURLState } from '@/hooks';
import { cn } from '@/lib/utils';

interface PaginationProps {
  totalItems: number;
  totalPages: number;
}

export function Pagination({ totalItems, totalPages }: PaginationProps) {
  const { page, setPage } = useURLState();

  if (totalPages <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 3; // Reduced for mobile

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-3 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-3 sm:mt-4 sm:flex-row sm:gap-4 sm:pt-4">
      {/* Info */}
      <p className="text-xs text-muted-foreground sm:text-sm">
        Page {page} of {totalPages}
        <span className="hidden sm:inline"> ({totalItems} items)</span>
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        {/* First page - hidden on mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(1)}
          disabled={!canGoPrevious}
          aria-label="Go to first page"
          className="hidden h-8 w-8 sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-6 items-center justify-center text-xs text-muted-foreground sm:w-8"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                size="icon"
                onClick={() => setPage(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
                className={cn(
                  'h-8 w-8 text-xs sm:text-sm',
                  page === pageNum && 'pointer-events-none'
                )}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page - hidden on mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(totalPages)}
          disabled={!canGoNext}
          aria-label="Go to last page"
          className="hidden h-8 w-8 sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
