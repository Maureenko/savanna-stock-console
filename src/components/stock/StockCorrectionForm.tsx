'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProduct } from '@/lib/api/products';
import type { Product } from '@/types/product';

interface StockCorrectionFormProps {
  product: Product;
}

export function StockCorrectionForm({ product }: StockCorrectionFormProps) {
  const [newStock, setNewStock] = useState<string>(String(product.stock));
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (stock: number) => updateProduct(product.id, { stock }),
    onMutate: async (stock) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['product', product.id] });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData<Product>(['product', product.id]);

      // Optimistically update
      queryClient.setQueryData<Product>(['product', product.id], (old) =>
        old ? { ...old, stock } : old
      );

      return { previousProduct };
    },
    onError: (_err, _stock, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', product.id], context.previousProduct);
        setNewStock(String(context.previousProduct.stock));
      }
      toast.error('Failed to update stock', {
        description: 'Please try again.',
      });
    },
    onSuccess: (updatedProduct) => {
      // Update with actual server response
      queryClient.setQueryData(['product', product.id], updatedProduct);
      // Also invalidate the products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Stock updated', {
        description: `Stock count set to ${updatedProduct.stock} units.`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const stockValue = parseInt(newStock, 10);

    if (isNaN(stockValue)) {
      setValidationError('Please enter a valid number');
      return;
    }

    if (stockValue < 0) {
      setValidationError('Stock cannot be negative');
      return;
    }

    if (stockValue === product.stock) {
      setValidationError('Stock value is unchanged');
      return;
    }

    mutation.mutate(stockValue);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
      <Label htmlFor="stock-correction" className="mb-2 block font-medium">
        Correct Stock Count
      </Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="stock-correction"
            type="number"
            min="0"
            value={newStock}
            onChange={(e) => {
              setNewStock(e.target.value);
              setValidationError(null);
            }}
            placeholder="Enter new stock count"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'stock-error' : undefined}
            disabled={mutation.isPending}
          />
          {validationError && (
            <p id="stock-error" className="mt-1 text-sm text-destructive">
              {validationError}
            </p>
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Update'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Note: Changes are simulated and won&apos;t persist after page refresh (API limitation).
      </p>
    </form>
  );
}
