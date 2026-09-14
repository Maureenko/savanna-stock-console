'use client';

import { Package, PackageX, TrendingDown } from 'lucide-react';

import { StatCard } from './StatCard';
import { useStockStats, useURLState } from '@/hooks';

export function DashboardStats() {
  const { stockStatus, setStockStatus } = useURLState();
  const { stats, isLoading } = useStockStats();

  const handleCardClick = (status: string) => {
    // Toggle: if already active, clear the filter
    if (stockStatus === status) {
      setStockStatus('');
    } else {
      setStockStatus(status);
    }
  };

  return (
    <div className="mb-6 grid grid-cols-3 gap-4">
      <StatCard
        title="Total Items"
        value={isLoading ? '-' : stats.total}
        icon={Package}
        variant="default"
        isLoading={isLoading}
        onClick={() => handleCardClick('')}
        isActive={stockStatus === ''}
      />
      <StatCard
        title="Low Stock"
        value={isLoading ? '-' : stats.lowStock}
        icon={TrendingDown}
        variant="warning"
        isLoading={isLoading}
        onClick={() => handleCardClick('Low Stock')}
        isActive={stockStatus === 'Low Stock'}
      />
      <StatCard
        title="Out of Stock"
        value={isLoading ? '-' : stats.outOfStock}
        icon={PackageX}
        variant="danger"
        isLoading={isLoading}
        onClick={() => handleCardClick('Out of Stock')}
        isActive={stockStatus === 'Out of Stock'}
      />
    </div>
  );
}
