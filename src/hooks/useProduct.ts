'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';

import { getProduct } from '@/lib/api/products';
import { applyStockCorrection, stockCorrectionsStore } from '@/lib/stock-corrections-store';

export function useProduct(id: number) {
  // Subscribe to stock corrections store to get updates
  const correctionsVersion = useSyncExternalStore(
    stockCorrectionsStore.subscribe.bind(stockCorrectionsStore),
    () => stockCorrectionsStore.getVersion(),
    () => 0
  );

  const query = useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProduct(id, signal),
    enabled: !isNaN(id) && id > 0,
  });

  // Apply local stock corrections to the fetched data
  // Include correctionsVersion in deps to re-run when corrections change
  const data = useMemo(() => {
    return query.data ? applyStockCorrection(query.data) : undefined;
  }, [query.data, correctionsVersion]);

  return {
    ...query,
    data,
  };
}
