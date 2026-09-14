'use client';

import { useQuery } from '@tanstack/react-query';

import { getProducts } from '@/lib/api/products';

interface StockStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

/**
 * Fetches ALL products to calculate accurate stock statistics.
 * Uses a longer stale time since this data changes less frequently.
 */
export function useStockStats() {
  const query = useQuery({
    queryKey: ['stock-stats'],
    queryFn: async ({ signal }) => {
      // Fetch all products (API max is ~194 items)
      const response = await getProducts({ limit: 200, skip: 0 }, signal);

      // Calculate stats from all products
      const stats: StockStats = {
        total: response.total,
        lowStock: 0,
        outOfStock: 0,
        inStock: 0,
      };

      for (const product of response.products) {
        switch (product.availabilityStatus) {
          case 'Low Stock':
            stats.lowStock++;
            break;
          case 'Out of Stock':
            stats.outOfStock++;
            break;
          default:
            stats.inStock++;
        }
      }

      return stats;
    },
    // Cache for 5 minutes since this is aggregate data
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    stats: query.data ?? { total: 0, lowStock: 0, outOfStock: 0, inStock: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
