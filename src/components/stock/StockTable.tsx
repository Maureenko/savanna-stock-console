'use client';

import { Eye, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface StockTableProps {
  products: Product[];
}

export function StockTable({ products }: StockTableProps) {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-savannah-purple/20 bg-savannah-purple/5 hover:bg-savannah-purple/5">
            <TableHead className="w-[56px] py-2 text-xs font-semibold">Image</TableHead>
            <TableHead className="py-2 text-xs font-semibold">Product</TableHead>
            <TableHead className="hidden py-2 text-xs font-semibold sm:table-cell">
              Category
            </TableHead>
            <TableHead className="py-2 text-right text-xs font-semibold">Price</TableHead>
            <TableHead className="py-2 text-right text-xs font-semibold">Stock</TableHead>
            <TableHead className="hidden py-2 text-xs font-semibold md:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden w-[80px] py-2 text-center text-xs font-semibold sm:table-cell">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const isLowStock = product.availabilityStatus === 'Low Stock';
            const isOutOfStock = product.availabilityStatus === 'Out of Stock';
            const isEvenRow = index % 2 === 0;

            return (
              <TableRow
                key={product.id}
                className={cn(
                  'transition-colors',
                  isEvenRow ? 'bg-white' : 'bg-savannah-purple/5',
                  'hover:bg-savannah-purple/10'
                )}
              >
                {/* Image */}
                <TableCell className="py-1.5">
                  <Link
                    href={`/items/${product.id}`}
                    className="block rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </Link>
                </TableCell>

                {/* Product Name */}
                <TableCell className="py-1.5">
                  <Link
                    href={`/items/${product.id}`}
                    className="rounded text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className="line-clamp-1">{product.title}</span>
                  </Link>
                  {/* Show category on mobile */}
                  <p className="text-[11px] capitalize text-muted-foreground sm:hidden">
                    {product.category.replace(/-/g, ' ')}
                  </p>
                  {/* Show status badge on mobile */}
                  <div className="mt-0.5 md:hidden">
                    <Badge
                      variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}
                      className="h-4 px-1 text-[9px]"
                    >
                      {product.availabilityStatus}
                    </Badge>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="hidden py-1.5 text-sm capitalize text-muted-foreground sm:table-cell">
                  {product.category.replace(/-/g, ' ')}
                </TableCell>

                {/* Price */}
                <TableCell className="py-1.5 text-right text-sm font-medium">
                  ${product.price.toFixed(2)}
                </TableCell>

                {/* Stock - Color coded */}
                <TableCell className="py-1.5 text-right">
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      isOutOfStock && 'text-destructive',
                      isLowStock && 'text-warning',
                      !isOutOfStock && !isLowStock && 'text-success'
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="hidden py-1.5 md:table-cell">
                  <Badge
                    variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}
                    className="h-5 text-[10px]"
                  >
                    {product.availabilityStatus}
                  </Badge>
                </TableCell>

                {/* Quick Actions */}
                <TableCell className="hidden py-1.5 sm:table-cell">
                  <div className="flex items-center justify-center gap-0.5">
                    <Link
                      href={`/items/${product.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-savannah-purple/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label={`View details for ${product.title}`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/items/${product.id}#stock`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-savannah-purple/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label={`Edit stock for ${product.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
