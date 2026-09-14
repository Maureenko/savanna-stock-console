'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';

import { useDebounce, useURLState } from '@/hooks';
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/api/products';
import { applyStockCorrections, stockCorrectionsStore } from '@/lib/stock-corrections-store';
import type { Product, ProductsResponse } from '@/types/product';

export function useProducts() {
  const { search, category, sortBy, order, skip, limit, stockStatus } = useURLState();

  // Subscribe to stock corrections store to get updates
  // Returns a version number that changes when corrections are updated
  const correctionsVersion = useSyncExternalStore(
    stockCorrectionsStore.subscribe.bind(stockCorrectionsStore),
    () => stockCorrectionsStore.getVersion(),
    () => 0
  );

  // Debounce search to avoid excessive API calls while typing
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ['products', { search: debouncedSearch, category, sortBy, order, skip, limit }];

  const queryFn = async ({ signal }: { signal: AbortSignal }): Promise<ProductsResponse> => {
    const params = { sortBy, order, limit, skip };

    // Determine which API to call based on filters
    if (debouncedSearch) {
      // Search takes priority
      return searchProducts(debouncedSearch, params, signal);
    } else if (category) {
      // Category filter
      return getProductsByCategory(category, params, signal);
    } else {
      // Default: get all products
      return getProducts(params, signal);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn,
    // Keep previous data while fetching new data for smooth transitions
    placeholderData: (previousData) => previousData,
    // Stale time from query client defaults (30s)
  });

  // Apply local stock corrections and client-side filtering by stock status
  // Include correctionsVersion in deps to re-run when corrections change
  const filteredData = useMemo(() => {
    if (!query.data) {
      return query.data;
    }

    // Apply local stock corrections to products
    let products = applyStockCorrections(query.data.products);

    // Client-side filtering by stock status (API doesn't support this filter)
    if (stockStatus) {
      products = products.filter((product: Product) => product.availabilityStatus === stockStatus);
    }

    return {
      ...query.data,
      products,
      total: stockStatus ? products.length : query.data.total,
    };
  }, [query.data, stockStatus, correctionsVersion]);

  return {
    ...query,
    data: filteredData,
    // Convenience flags
    isEmpty: filteredData?.products.length === 0 && !query.isLoading,
    totalItems: filteredData?.total ?? 0,
    totalPages: filteredData ? Math.ceil(filteredData.total / limit) : 0,
  };
}
