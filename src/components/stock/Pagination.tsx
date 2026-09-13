'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useURLState } from '@/hooks';

interface PaginationProps {
  totalItems: number;
  totalPages: number;
}

export function Pagination({ totalItems, totalPages }: PaginationProps) {
  const { page, setPage, limit, skip } = useURLState();

  if (totalPages <= 1) {
    return null;
  }

  const startItem = skip + 1;
  const endItem = Math.min(skip + limit, totalItems);

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
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
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} items
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === page ? 'page' : undefined}
                className="min-w-[36px]"
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Go to next page"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
