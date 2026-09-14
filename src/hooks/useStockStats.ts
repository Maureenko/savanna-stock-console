'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';

import { getProducts } from '@/lib/api/products';
import { applyStockCorrections, stockCorrectionsStore } from '@/lib/stock-corrections-store';

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
  // Subscribe to stock corrections store to get updates
  const correctionsVersion = useSyncExternalStore(
    stockCorrectionsStore.subscribe.bind(stockCorrectionsStore),
    () => stockCorrectionsStore.getVersion(),
    () => 0
  );

  const query = useQuery({
    queryKey: ['stock-stats'],
    queryFn: async ({ signal }) => {
      // Fetch all products (API max is ~194 items)
      const response = await getProducts({ limit: 200, skip: 0 }, signal);
      return response;
    },
    // Cache for 5 minutes since this is aggregate data
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Calculate stats with local corrections applied
  // Include correctionsVersion in deps to re-run when corrections change
  const stats = useMemo<StockStats>(() => {
    if (!query.data) {
      return { total: 0, lowStock: 0, outOfStock: 0, inStock: 0 };
    }

    // Apply local stock corrections
    const products = applyStockCorrections(query.data.products);

    const result: StockStats = {
      total: query.data.total,
      lowStock: 0,
      outOfStock: 0,
      inStock: 0,
    };

    for (const product of products) {
      // Recalculate availability status based on corrected stock
      const stock = product.stock;
      if (stock === 0) {
        result.outOfStock++;
      } else if (stock <= 10) {
        result.lowStock++;
      } else {
        result.inStock++;
      }
    }

    return result;
  }, [query.data, correctionsVersion]);

  return {
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
