'use client';

import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StatVariant = 'default' | 'warning' | 'danger' | 'success';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: StatVariant;
  isLoading?: boolean;
}

const variantStyles: Record<StatVariant, { text: string; bg: string }> = {
  default: {
    text: 'text-foreground',
    bg: 'bg-muted',
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning/10',
  },
  danger: {
    text: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success/10',
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  isLoading,
}: StatCardProps) {
  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className="border border-savannah-lime/30 bg-gradient-to-br from-background to-savannah-lime/5">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <Skeleton className="h-3 w-12 sm:h-4 sm:w-20" />
              <Skeleton className="h-5 w-8 sm:h-8 sm:w-16" />
            </div>
            <Skeleton className="h-8 w-8 flex-shrink-0 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'group border border-savannah-lime/30 bg-gradient-to-br from-background to-savannah-lime/5',
        'transition-all duration-300 ease-out',
        'hover:border-savannah-lime/60 hover:shadow-md hover:shadow-savannah-lime/10'
      )}
    >
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
            <p className="truncate text-[0.65rem] font-medium text-muted-foreground sm:text-sm">
              {title}
            </p>
            <p className={cn('text-lg font-bold tabular-nums sm:text-3xl', styles.text)}>{value}</p>
          </div>
          <div
            className={cn(
              'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
              'bg-savannah-lime/20 text-savannah-lime',
              'transition-all duration-300',
              'group-hover:bg-savannah-lime group-hover:text-savannah-purple'
            )}
          >
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
