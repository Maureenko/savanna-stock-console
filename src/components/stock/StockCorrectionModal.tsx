'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Package, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { activityStore, createActivityEntry } from '@/lib/activity-store';
import { updateProduct } from '@/lib/api/products';
import { stockCorrectionsStore } from '@/lib/stock-corrections-store';
import type { Product } from '@/types/product';

interface StockCorrectionModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockCorrectionModal({ product, isOpen, onClose }: StockCorrectionModalProps) {
  const [physicalStock, setPhysicalStock] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Use ref to capture the stock value at the moment of submission
  const stockAtSubmitRef = useRef<number>(0);

  // Reset form state when modal opens - this is intentional for form reset on open
  useEffect(() => {
    if (isOpen && product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhysicalStock(String(product.stock));
      setValidationError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, product]);

  const mutation = useMutation({
    mutationFn: (stock: number) => updateProduct(product!.id, { stock }),
    onMutate: async (stock) => {
      await queryClient.cancelQueries({ queryKey: ['product', product!.id] });
      const previousProduct = queryClient.getQueryData<Product>(['product', product!.id]);
      queryClient.setQueryData<Product>(['product', product!.id], (old) =>
        old ? { ...old, stock } : old
      );
      return { previousProduct };
    },
    onError: (_err, _stock, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', product!.id], context.previousProduct);
      }
      setValidationError('Failed to update stock. Please try again.');
      setSuccessMessage(null);
    },
    onSuccess: (updatedProduct, newStockValue) => {
      const previousStockValue = stockAtSubmitRef.current;

      // Store the correction locally so it persists across page navigation
      stockCorrectionsStore.setCorrection(product!.id, newStockValue);

      // Update cache with the corrected stock value
      queryClient.setQueryData(['product', product!.id], {
        ...updatedProduct,
        stock: newStockValue,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-stats'] });

      const userName = user ? `${user.firstName} ${user.lastName}` : 'Current User';
      const entry = createActivityEntry(product!.id, previousStockValue, newStockValue, userName);
      activityStore.addEntry(product!.id, entry);

      setSuccessMessage(`Stock updated! ${previousStockValue} → ${newStockValue}`);
      setValidationError(null);

      setTimeout(() => {
        onClose();
      }, 1500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setValidationError(null);
    setSuccessMessage(null);

    const stockValue = parseInt(physicalStock, 10);

    if (isNaN(stockValue)) {
      setValidationError('Please enter a valid number');
      return;
    }

    if (stockValue < 0) {
      setValidationError('Stock cannot be negative');
      return;
    }

    // Capture the current stock value RIGHT before submitting
    // This is the value that will be shown as "previous" in the activity log
    stockAtSubmitRef.current = product.stock;

    if (stockValue === product.stock) {
      setValidationError('No change needed - values match');
      return;
    }

    mutation.mutate(stockValue);
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-2xl sm:rounded-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-savannah-purple/10 sm:h-10 sm:w-10">
              <Package className="h-4 w-4 text-savannah-purple sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-semibold sm:text-lg">
                Stock Correction
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">Update physical count</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-3 rounded-lg bg-muted/50 p-2 sm:mb-4 sm:p-3">
          <h3 className="text-sm font-medium text-foreground sm:text-base">{product.title}</h3>
          {product.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 sm:mt-1 sm:text-sm">
              {product.description}
            </p>
          )}
        </div>

        {/* Stock Comparison */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-3">
          <div className="rounded-lg border border-border bg-background p-2 text-center sm:p-3">
            <p className="text-[0.65rem] text-muted-foreground sm:text-xs">System Stock</p>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">{product.stock}</p>
          </div>
          <div className="rounded-lg border-2 border-savannah-purple/30 bg-savannah-purple/5 p-2 text-center sm:p-3">
            <p className="text-[0.65rem] text-muted-foreground sm:text-xs">Physical Count</p>
            <p className="text-xl font-bold tabular-nums text-savannah-purple sm:text-2xl">
              {physicalStock || '-'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="physical-stock" className="text-xs font-medium sm:text-sm">
              Enter Physical Stock Count
            </Label>
            <Input
              id="physical-stock"
              type="number"
              min="0"
              value={physicalStock}
              onChange={(e) => {
                setPhysicalStock(e.target.value);
                setValidationError(null);
                setSuccessMessage(null);
              }}
              placeholder="Enter counted quantity"
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'stock-error' : undefined}
              disabled={mutation.isPending}
              className="mt-1 h-9 text-sm sm:mt-1.5 sm:h-10"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive sm:p-3 sm:text-sm">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-2 text-xs text-success sm:p-3 sm:text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 flex-1 text-sm sm:h-10"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 flex-1 text-sm sm:h-10"
              disabled={mutation.isPending || !!successMessage}
            >
              {mutation.isPending ? 'Updating...' : 'Correct Stock'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
