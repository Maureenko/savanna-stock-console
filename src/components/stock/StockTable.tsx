'use client';

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
import type { Product } from '@/types/product';

interface StockTableProps {
  products: Product[];
}

export function StockTable({ products }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.availabilityStatus === 'Low Stock';
            const isOutOfStock = product.availabilityStatus === 'Out of Stock';

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    href={`/items/${product.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/items/${product.id}`}
                    className="font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  >
                    <span className="line-clamp-2">{product.title}</span>
                  </Link>
                  <p className="text-xs text-muted-foreground sm:hidden capitalize">
                    {product.category.replace(/-/g, ' ')}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell capitalize text-muted-foreground">
                  {product.category.replace(/-/g, ' ')}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      isOutOfStock
                        ? 'text-destructive font-semibold'
                        : isLowStock
                          ? 'text-orange-600 font-semibold'
                          : ''
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={isOutOfStock ? 'destructive' : isLowStock ? 'secondary' : 'default'}
                    className={
                      !isOutOfStock && !isLowStock
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : ''
                    }
                  >
                    {product.availabilityStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
