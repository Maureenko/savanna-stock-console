'use client';

import { Suspense } from 'react';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { DashboardLayout } from '@/components/layout';
import {
  DashboardStats,
  Pagination,
  SearchInput,
  SortSelect,
  StockTable,
} from '@/components/stock';
import { useProducts, useURLState } from '@/hooks';

function StockListContent() {
  const { resetFilters, search, category, stockStatus } = useURLState();
  const { data, isLoading, isError, error, refetch, isEmpty, isFetching, totalItems, totalPages } =
    useProducts();

  const hasActiveFilters = search || category || stockStatus;

  return (
    <div className="min-h-full w-full max-w-full overflow-x-hidden bg-savannah-purple/5 p-3 sm:p-4 md:p-6">
      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Search and Filters Card */}
      <div className="mb-3 rounded-lg bg-white p-3 shadow-sm sm:mb-4 sm:rounded-xl sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <SearchInput />
          <div className="w-full sm:w-auto">
            <SortSelect />
          </div>
        </div>
        {/* Status bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <p className="text-xs text-muted-foreground sm:text-sm">
            {totalItems} items
            {search && <span className="hidden sm:inline"> • Searching: &quot;{search}&quot;</span>}
            {search && <span className="sm:hidden"> • &quot;{search}&quot;</span>}
            {category && ` • ${category.replace(/-/g, ' ')}`}
            {stockStatus && ` • ${stockStatus}`}
          </p>
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground">Updating...</span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Error State */}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load products'}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && isEmpty && (
        <EmptyState onReset={hasActiveFilters ? resetFilters : undefined} />
      )}

      {/* Product Table Card */}
      {!isLoading && !isError && data && data.products.length > 0 && (
        <div className="overflow-hidden rounded-lg bg-white p-3 shadow-sm sm:rounded-xl sm:p-4">
          <div className="overflow-x-auto">
            <StockTable products={data.products} />
          </div>
          <Pagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingState />}>
        <StockListContent />
      </Suspense>
    </DashboardLayout>
  );
}
