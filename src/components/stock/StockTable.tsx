'use client';

import { Eye, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

import { StockCorrectionModal } from './StockCorrectionModal';

interface StockTableProps {
  products: Product[];
}

export function StockTable({ products }: StockTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditStock = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-savannah-purple/20 bg-savannah-purple/5 hover:bg-savannah-purple/5">
              <TableHead className="w-10 py-2 text-[0.65rem] font-semibold sm:w-14 sm:text-xs">
                Img
              </TableHead>
              <TableHead className="py-2 text-[0.65rem] font-semibold sm:text-xs">
                Product
              </TableHead>
              <TableHead className="hidden py-2 text-[0.65rem] font-semibold md:table-cell sm:text-xs">
                Category
              </TableHead>
              <TableHead className="py-2 text-right text-[0.65rem] font-semibold sm:text-xs">
                Price
              </TableHead>
              <TableHead className="py-2 text-right text-[0.65rem] font-semibold sm:text-xs">
                Stock
              </TableHead>
              <TableHead className="hidden py-2 text-[0.65rem] font-semibold lg:table-cell sm:text-xs">
                Status
              </TableHead>
              <TableHead className="w-14 py-2 text-center text-[0.65rem] font-semibold sm:w-20 sm:text-xs">
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
                    isEvenRow ? 'bg-white' : 'bg-savannah-lime/10',
                    'hover:bg-savannah-lime/20'
                  )}
                >
                  {/* Image */}
                  <TableCell className="py-1 sm:py-1.5">
                    <Link
                      href={`/items/${product.id}`}
                      className="block rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <div className="relative h-8 w-8 overflow-hidden rounded bg-muted sm:h-10 sm:w-10">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="2.5rem"
                        />
                      </div>
                    </Link>
                  </TableCell>

                  {/* Product Name */}
                  <TableCell className="max-w-[7.5rem] py-1 sm:max-w-none sm:py-1.5">
                    <Link
                      href={`/items/${product.id}`}
                      className="rounded text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm"
                    >
                      <span className="line-clamp-1">{product.title}</span>
                    </Link>
                    {/* Show category on mobile */}
                    <p className="truncate text-[0.6rem] capitalize text-muted-foreground md:hidden">
                      {product.category.replace(/-/g, ' ')}
                    </p>
                    {/* Show status badge on mobile */}
                    <div className="mt-0.5 lg:hidden">
                      <Badge
                        variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}
                        className="h-4 px-1 text-[0.5rem] sm:text-[0.6rem]"
                      >
                        {isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'OK'}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="hidden py-1.5 text-xs capitalize text-muted-foreground md:table-cell sm:text-sm">
                    {product.category.replace(/-/g, ' ')}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="py-1 text-right text-xs font-medium sm:py-1.5 sm:text-sm">
                    ${product.price.toFixed(2)}
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="py-1 text-right sm:py-1.5">
                    <span
                      className={cn(
                        'text-xs font-semibold tabular-nums sm:text-sm',
                        isOutOfStock && 'text-destructive',
                        isLowStock && 'text-warning',
                        !isOutOfStock && !isLowStock && 'text-success'
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="hidden py-1.5 lg:table-cell">
                    <Badge
                      variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}
                      className="h-5 text-[0.6rem] sm:text-[0.65rem]"
                    >
                      {product.availabilityStatus}
                    </Badge>
                  </TableCell>

                  {/* Quick Actions */}
                  <TableCell className="py-1 sm:py-1.5">
                    <div className="flex items-center justify-center gap-0.5">
                      <Link
                        href={`/items/${product.id}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-savannah-purple/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:h-7 sm:w-7"
                        aria-label={`View details for ${product.title}`}
                      >
                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => handleEditStock(product)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-savannah-purple/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:h-7 sm:w-7"
                        aria-label={`Edit stock for ${product.title}`}
                      >
                        <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Stock Correction Modal */}
      <StockCorrectionModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
