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
    <div className="min-h-full bg-savannah-lime/10 p-4 sm:p-6">
      {/* Dashboard Stats - fetches all products for accurate counts */}
      <DashboardStats />

      {/* Search and Filters Card */}
      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <SearchInput />
          <div className="flex gap-4">
            <SortSelect />
          </div>
        </div>
        {/* Status bar */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-sm text-muted-foreground">
            {totalItems} items
            {search && ` • Searching: "${search}"`}
            {category && ` • ${category.replace(/-/g, ' ')}`}
            {stockStatus && ` • Status: ${stockStatus}`}
          </p>
          {/* Show subtle loading indicator when refetching */}
          {isFetching && !isLoading && (
            <span className="text-sm text-muted-foreground">Updating...</span>
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
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <StockTable products={data.products} />
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
