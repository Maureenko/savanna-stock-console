'use client';

import { useQuery } from '@tanstack/react-query';

import { useDebounce, useURLState } from '@/hooks';
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/api/products';
import type { ProductsResponse } from '@/types/product';

export function useProducts() {
  const { search, category, sortBy, order, skip, limit } = useURLState();

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

  return {
    ...query,
    // Convenience flags
    isEmpty: query.data?.products.length === 0 && !query.isLoading,
    totalItems: query.data?.total ?? 0,
    totalPages: query.data ? Math.ceil(query.data.total / limit) : 0,
  };
}
