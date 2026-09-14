'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Product } from '@/types/product';

interface StockCardProps {
  product: Product;
}

export function StockCard({ product }: StockCardProps) {
  const searchParams = useSearchParams();
  const isLowStock = product.availabilityStatus === 'Low Stock';
  const isOutOfStock = product.availabilityStatus === 'Out of Stock';

  // Build item detail link with preserved search params
  const params = searchParams.toString();
  const itemLink = params ? `/items/${product.id}?${params}` : `/items/${product.id}`;

  return (
    <Link
      href={itemLink}
      className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-medium leading-tight">{product.title}</h3>
          </div>

          <p className="mb-2 text-sm text-muted-foreground capitalize">
            {product.category.replace(/-/g, ' ')}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-semibold">${product.price.toFixed(2)}</span>

            <Badge
              variant={isOutOfStock ? 'destructive' : isLowStock ? 'secondary' : 'default'}
              className={
                !isOutOfStock && !isLowStock ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
              }
            >
              {product.stock} in stock
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
