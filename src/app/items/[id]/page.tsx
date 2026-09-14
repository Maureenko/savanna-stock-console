'use client';

import { ArrowLeft, Pencil, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ErrorState } from '@/components/common';
import { DashboardLayout } from '@/components/layout';
import { ActivityLog, StockCorrectionModal } from '@/components/stock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks';

function ItemDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  // Build back link with preserved filters
  const backLink = `/items?${searchParams.toString()}`;

  if (isLoading) {
    return <ItemDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href={backLink}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to list
            </Button>
          </Link>
          <ErrorState
            message={error instanceof Error ? error.message : 'Failed to load product details'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const isLowStock = product.availabilityStatus === 'Low Stock';
  const isOutOfStock = product.availabilityStatus === 'Out of Stock';

  return (
    <div className="min-h-full bg-savannah-purple/5 p-2 sm:p-4">
      {/* Header */}
      <div className="mb-2 sm:mb-3">
        <Link href={backLink}>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm">
            <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Back to list
          </Button>
        </Link>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:gap-4 lg:flex-row">
        {/* Top on mobile / Left on desktop: Product Image */}
        <div className="flex flex-row gap-2 sm:flex-col lg:w-44">
          <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm sm:w-full">
            <Image
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 6rem, 11rem"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex flex-row gap-1 sm:grid sm:grid-cols-4">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-10 flex-shrink-0 overflow-hidden rounded bg-white sm:w-auto"
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="2.5rem"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Product Info */}
        <div className="flex-1 rounded-xl bg-white p-3 shadow-sm sm:p-4">
          {/* Title and Category */}
          <div className="mb-1 sm:mb-2">
            <p className="text-[0.65rem] capitalize text-muted-foreground sm:text-xs">
              {product.category?.replace(/-/g, ' ')}
            </p>
            <h1 className="text-base font-bold sm:text-lg">{product.title}</h1>
          </div>

          {/* Price and Rating */}
          <div className="mb-1 flex flex-wrap items-center gap-1 sm:mb-2 sm:gap-2">
            <span className="text-base font-bold sm:text-lg">
              ${product.price?.toFixed(2) ?? '0.00'}
            </span>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <Badge variant="secondary" className="text-[0.6rem] sm:text-xs">
                {product.discountPercentage.toFixed(0)}% off
              </Badge>
            )}
            {product.rating && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[0.6rem] text-muted-foreground sm:text-xs">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mb-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm">
              {product.description}
            </p>
          )}

          {/* Quick Info Grid */}
          <div className="mb-2 flex flex-wrap gap-1 text-[0.6rem] sm:mb-3 sm:gap-2 sm:text-xs">
            {product.sku && (
              <div className="rounded bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1">
                <span className="text-muted-foreground">SKU:</span>{' '}
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.brand && (
              <div className="rounded bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1">
                <span className="text-muted-foreground">Brand:</span>{' '}
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="hidden rounded bg-muted/50 px-1.5 py-0.5 sm:block sm:px-2 sm:py-1">
                <span className="text-muted-foreground">Shipping:</span>{' '}
                <span className="font-medium">{product.shippingInformation}</span>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="hidden rounded bg-muted/50 px-1.5 py-0.5 sm:block sm:px-2 sm:py-1">
                <span className="text-muted-foreground">Warranty:</span>{' '}
                <span className="font-medium">{product.warrantyInformation}</span>
              </div>
            )}
          </div>

          {/* Stock Status Section */}
          <div className="rounded-lg border border-border bg-muted/20 p-2 sm:p-3">
            <div className="mb-1.5 flex items-center justify-between sm:mb-2">
              <h3 className="text-xs font-semibold sm:text-sm">Stock Information</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="h-7 gap-1 px-2 text-[0.65rem] sm:h-8 sm:gap-1.5 sm:px-3 sm:text-xs"
              >
                <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Correct Stock
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* System Stock */}
              <div className="rounded-lg bg-white p-2 text-center shadow-sm sm:p-3">
                <p className="text-[0.6rem] text-muted-foreground sm:text-xs">System Stock</p>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{product.stock}</p>
              </div>
              {/* Physical Stock (same as system for now - updates via modal) */}
              <div className="rounded-lg bg-savannah-purple/5 p-2 text-center sm:p-3">
                <p className="text-[0.6rem] text-muted-foreground sm:text-xs">Physical Stock</p>
                <p className="text-xl font-bold tabular-nums text-savannah-purple sm:text-2xl">
                  {product.stock}
                </p>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-center sm:mt-2">
              <Badge
                variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}
                className="text-[0.6rem] sm:text-xs"
              >
                {product.availabilityStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom on mobile / Right on desktop: Activity Log */}
        <div className="w-full lg:w-72">
          <div className="max-h-64 overflow-hidden rounded-xl bg-white shadow-sm sm:max-h-96">
            <ActivityLog productId={product.id} currentStock={product.stock} compact />
          </div>
        </div>
      </div>

      {/* Stock Correction Modal */}
      <StockCorrectionModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function ItemDetailSkeleton() {
  return (
    <div className="min-h-full bg-savannah-purple/5 p-2 sm:p-4">
      <Skeleton className="mb-2 h-8 w-24 sm:mb-3 sm:w-32" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:gap-4 lg:flex-row">
        <div className="flex flex-row gap-2 sm:flex-col lg:w-44">
          <Skeleton className="aspect-square w-24 rounded-lg sm:w-full" />
        </div>
        <div className="flex-1 rounded-xl bg-white p-3 sm:p-4">
          <Skeleton className="mb-1 h-3 w-20 sm:mb-2 sm:h-4 sm:w-24" />
          <Skeleton className="mb-1 h-4 w-3/4 sm:mb-2 sm:h-5" />
          <Skeleton className="mb-2 h-4 w-24 sm:mb-2 sm:h-5 sm:w-32" />
          <Skeleton className="h-20 w-full sm:h-24" />
        </div>
        <div className="w-full lg:w-72">
          <Skeleton className="h-48 rounded-lg sm:h-64" />
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  return (
    <DashboardLayout>
      <ItemDetailContent />
    </DashboardLayout>
  );
}
