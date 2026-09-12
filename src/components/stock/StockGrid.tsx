import type { Product } from '@/types/product';

import { StockCard } from './StockCard';

interface StockGridProps {
  products: Product[];
}

export function StockGrid({ products }: StockGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <StockCard key={product.id} product={product} />
      ))}
    </div>
  );
}
