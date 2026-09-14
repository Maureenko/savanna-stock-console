'use client';

import { Package, PackageX, TrendingDown } from 'lucide-react';

import { useStockStats } from '@/hooks';

import { StatCard } from './StatCard';

export function DashboardStats() {
  const { stats, isLoading } = useStockStats();

  return (
    <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-4">
      <StatCard
        title="Total Items"
        value={isLoading ? '-' : stats.total}
        icon={Package}
        variant="default"
        isLoading={isLoading}
      />
      <StatCard
        title="Low Stock"
        value={isLoading ? '-' : stats.lowStock}
        icon={TrendingDown}
        variant="warning"
        isLoading={isLoading}
      />
      <StatCard
        title="Out of Stock"
        value={isLoading ? '-' : stats.outOfStock}
        icon={PackageX}
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
