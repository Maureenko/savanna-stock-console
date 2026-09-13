'use client';

import { Suspense } from 'react';

import { ProtectedRoute, useAuth } from '@/components/auth';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { CategorySelect, Pagination, SearchInput, SortSelect, StockGrid } from '@/components/stock';
import { Button } from '@/components/ui/button';
import { useProducts, useURLState } from '@/hooks';

function StockListContent() {
  const { user, logout } = useAuth();
  const { resetFilters, search, category } = useURLState();
  const { data, isLoading, isError, error, refetch, isEmpty, isFetching, totalItems, totalPages } =
    useProducts();

  const hasActiveFilters = search || category;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Console</h1>
          {user && (
            <p className="text-muted-foreground">
              Welcome, {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={logout}>
          Sign out
        </Button>
      </header>

      <main>
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput />
          <div className="flex gap-2">
            <CategorySelect />
            <SortSelect />
          </div>
        </div>

        {/* Status bar */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalItems} items
            {search && ` • Searching: "${search}"`}
            {category && ` • ${category.replace(/-/g, ' ')}`}
          </p>
          {/* Show subtle loading indicator when refetching */}
          {isFetching && !isLoading && (
            <span className="text-sm text-muted-foreground">Updating...</span>
          )}
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

        {/* Product Grid */}
        {!isLoading && !isError && data && data.products.length > 0 && (
          <>
            <StockGrid products={data.products} />
            <Pagination totalItems={totalItems} totalPages={totalPages} />
          </>
        )}
      </main>
    </div>
  );
}

export default function ItemsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingState />}>
        <StockListContent />
      </Suspense>
    </ProtectedRoute>
  );
}
