'use client';

import { ChevronRight, LayoutGrid, Package, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories, useURLState } from '@/hooks';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: categories, isLoading } = useCategories();
  const { category: activeCategory, setCategory } = useURLState();
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on a detail page
  const isDetailPage = pathname.startsWith('/items/') && pathname !== '/items';

  const handleCategoryClick = (categorySlug: string) => {
    // If on detail page, navigate to items list with category filter
    if (isDetailPage) {
      const url = categorySlug ? `/items?category=${categorySlug}` : '/items';
      router.push(url);
    } else {
      // If clicking the active category, clear it
      if (activeCategory === categorySlug) {
        setCategory('');
      } else {
        setCategory(categorySlug);
      }
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleAllItemsClick = () => {
    if (isDetailPage) {
      router.push('/items');
    } else {
      setCategory('');
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-50 h-[calc(100dvh-3.5rem)] w-56 bg-savannah-purple text-white shadow-xl transition-transform duration-200 ease-in-out sm:top-16 sm:h-[calc(100dvh-4rem)] sm:w-64',
          'lg:relative lg:top-0 lg:z-30 lg:h-full lg:transition-[width]',
          isOpen
            ? 'translate-x-0 lg:translate-x-0'
            : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden'
        )}
        aria-label="Categories navigation"
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 text-white hover:bg-savannah-purple-light lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Category list */}
        <nav className="h-full w-56 overflow-y-auto p-2 pt-12 sm:w-64 lg:pt-2">
          {/* All Items */}
          <button
            onClick={handleAllItemsClick}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              !activeCategory
                ? 'bg-savannah-lime font-medium text-savannah-purple'
                : 'text-white/80 hover:bg-savannah-purple-light hover:text-white'
            )}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">All Items</span>
            {!activeCategory && (
              <ChevronRight className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
            )}
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-white/10" />

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/20" />
                  <Skeleton className="h-4 flex-1 bg-white/20" />
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {!isLoading && categories && (
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    activeCategory === cat.slug
                      ? 'bg-savannah-lime font-medium text-savannah-purple'
                      : 'text-white/80 hover:bg-savannah-purple-light hover:text-white'
                  )}
                >
                  <Package className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate capitalize">
                    {cat.name || cat.slug.replace(/-/g, ' ')}
                  </span>
                  {activeCategory === cat.slug && (
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
