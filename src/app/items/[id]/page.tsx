'use client';

import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import { ErrorState } from '@/components/common';
import { DashboardLayout } from '@/components/layout';
import { ActivityLog, StockCorrectionForm } from '@/components/stock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/hooks';

function ItemDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);

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
    <div className="min-h-full bg-savannah-lime/10 p-4">
      {/* Header */}
      <div className="mb-3">
        <Link href={backLink}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Button>
        </Link>
      </div>

      {/* Main Content - Centered */}
      <div className="mx-auto flex max-w-6xl flex-wrap gap-4 lg:flex-nowrap">
        {/* Left: Product Image */}
        <div className="flex w-full flex-col gap-2 sm:w-40 lg:w-44">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
            <Image
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="176px"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-1">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded bg-white"
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Product Info */}
        <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
          {/* Title and Category */}
          <div className="mb-2">
            <p className="text-xs capitalize text-muted-foreground">
              {product.category?.replace(/-/g, ' ')}
            </p>
            <h1 className="text-lg font-bold">{product.title}</h1>
          </div>

          {/* Price and Rating */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold">${product.price?.toFixed(2) ?? '0.00'}</span>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <Badge variant="secondary" className="text-xs">
                {product.discountPercentage.toFixed(0)}% off
              </Badge>
            )}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mb-2 text-sm text-muted-foreground">{product.description}</p>
          )}

          {/* Quick Info Grid */}
          <div className="mb-2 flex flex-wrap gap-2 text-xs">
            {product.sku && (
              <div className="rounded bg-muted/50 px-2 py-1">
                <span className="text-muted-foreground">SKU:</span>{' '}
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.brand && (
              <div className="rounded bg-muted/50 px-2 py-1">
                <span className="text-muted-foreground">Brand:</span>{' '}
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="rounded bg-muted/50 px-2 py-1">
                <span className="text-muted-foreground">Shipping:</span>{' '}
                <span className="font-medium">{product.shippingInformation}</span>
              </div>
            )}
          </div>

          {/* Stock Status Bar */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <span className="text-xl font-bold tabular-nums">{product.stock}</span>
            <Badge variant={isOutOfStock ? 'destructive' : isLowStock ? 'warning' : 'success'}>
              {product.availabilityStatus}
            </Badge>
          </div>
        </div>

        {/* Right: Stock Management & Activity */}
        <div className="flex w-full flex-col gap-3 lg:w-64">
          {/* Stock Correction Card */}
          <Card className="border-2 border-primary/20" id="stock">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm">Stock Correction</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <StockCorrectionForm product={product} compact />
            </CardContent>
          </Card>

          {/* Activity Log */}
          <div className="max-h-64 overflow-hidden rounded-xl bg-white shadow-sm">
            <ActivityLog productId={product.id} currentStock={product.stock} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemDetailSkeleton() {
  return (
    <div className="min-h-full bg-savannah-lime/10 p-4">
      <Skeleton className="mb-3 h-8 w-32" />
      <div className="mx-auto flex max-w-6xl gap-4">
        <div className="w-44">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
        <div className="flex-1 rounded-xl bg-white p-4">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="mb-2 h-5 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex w-64 flex-col gap-3">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
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
