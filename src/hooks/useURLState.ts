'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface URLState {
  search: string;
  category: string;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
}

const DEFAULT_STATE: URLState = {
  search: '',
  category: '',
  sortBy: 'title',
  order: 'asc',
  page: 1,
};

const PAGE_SIZE = 10;

export function useURLState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current URL state
  const state = useMemo((): URLState => {
    const search = searchParams.get('search') || DEFAULT_STATE.search;
    const category = searchParams.get('category') || DEFAULT_STATE.category;
    const sortBy = searchParams.get('sortBy') || DEFAULT_STATE.sortBy;
    const orderParam = searchParams.get('order');
    const order = orderParam === 'asc' || orderParam === 'desc' ? orderParam : DEFAULT_STATE.order;

    // Parse and validate page number
    const pageParam = searchParams.get('page');
    let page = DEFAULT_STATE.page;
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        page = parsed;
      }
    }

    return { search, category, sortBy, order, page };
  }, [searchParams]);

  // Update URL with new params (shallow routing)
  const updateURL = useCallback(
    (updates: Partial<URLState>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          value === DEFAULT_STATE[key as keyof URLState]
        ) {
          // Remove param if it matches default or is empty
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newURL, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Individual setters
  const setSearch = useCallback(
    (search: string) => {
      // Reset to page 1 when search changes
      updateURL({ search, page: 1 });
    },
    [updateURL]
  );

  const setCategory = useCallback(
    (category: string) => {
      // Reset to page 1 when category changes
      updateURL({ category, page: 1 });
    },
    [updateURL]
  );

  const setSort = useCallback(
    (sortBy: string, order: 'asc' | 'desc') => {
      // Reset to page 1 when sort changes
      updateURL({ sortBy, order, page: 1 });
    },
    [updateURL]
  );

  const setPage = useCallback(
    (page: number) => {
      updateURL({ page: Math.max(1, page) });
    },
    [updateURL]
  );

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Calculate skip for API pagination
  const skip = useMemo(() => (state.page - 1) * PAGE_SIZE, [state.page]);

  return {
    ...state,
    skip,
    limit: PAGE_SIZE,
    setSearch,
    setCategory,
    setSort,
    setPage,
    resetFilters,
    updateURL,
  };
}
