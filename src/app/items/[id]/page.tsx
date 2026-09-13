'use client';

import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import { ProtectedRoute } from '@/components/auth';
import { ErrorState } from '@/components/common';
import { StockCorrectionForm } from '@/components/stock';
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
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <Link href={backLink}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Button>
        </Link>
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load product details'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isLowStock = product.availabilityStatus === 'Low Stock';
  const isOutOfStock = product.availabilityStatus === 'Out of Stock';

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <Link href={backLink}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[0] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm capitalize text-muted-foreground">
              {product.category.replace(/-/g, ' ')} • {product.brand}
            </p>
            <h1 className="text-3xl font-bold">{product.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <Badge variant="secondary">{product.discountPercentage.toFixed(0)}% off</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Stock Card - Prominent for clinic use case */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Stock</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{product.stock}</span>
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
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>SKU: {product.sku}</p>
                <p>Min Order: {product.minimumOrderQuantity} units</p>
              </div>

              {/* Stock Correction Form */}
              <StockCorrectionForm product={product} />
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Shipping</h3>
              <p className="text-sm text-muted-foreground">{product.shippingInformation}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Warranty</h3>
              <p className="text-sm text-muted-foreground">{product.warrantyInformation}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Return Policy</h3>
              <p className="text-sm text-muted-foreground">{product.returnPolicy}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Dimensions</h3>
              <p className="text-sm text-muted-foreground">
                {product.dimensions.width} × {product.dimensions.height} ×{' '}
                {product.dimensions.depth} cm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemDetailSkeleton() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <Skeleton className="mb-6 h-10 w-32" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  return (
    <ProtectedRoute>
      <ItemDetailContent />
    </ProtectedRoute>
  );
}
