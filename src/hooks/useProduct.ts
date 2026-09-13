'use client';

import { useQuery } from '@tanstack/react-query';

import { getProduct } from '@/lib/api/products';

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProduct(id, signal),
    enabled: !isNaN(id) && id > 0,
  });
}
