'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useDebounce, useURLState } from '@/hooks';
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/api/products';
import type { Product, ProductsResponse } from '@/types/product';

export function useProducts() {
  const { search, category, sortBy, order, skip, limit, stockStatus } = useURLState();

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

  // Client-side filtering by stock status (API doesn't support this filter)
  const filteredData = useMemo(() => {
    if (!query.data || !stockStatus) {
      return query.data;
    }

    const filteredProducts = query.data.products.filter(
      (product: Product) => product.availabilityStatus === stockStatus
    );

    return {
      ...query.data,
      products: filteredProducts,
      total: filteredProducts.length,
    };
  }, [query.data, stockStatus]);

  return {
    ...query,
    data: filteredData,
    // Convenience flags
    isEmpty: filteredData?.products.length === 0 && !query.isLoading,
    totalItems: filteredData?.total ?? 0,
    totalPages: filteredData ? Math.ceil(filteredData.total / limit) : 0,
  };
}
