'use client';

import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/lib/api/products';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories(signal),
    // Categories change rarely, so we can cache them longer
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
