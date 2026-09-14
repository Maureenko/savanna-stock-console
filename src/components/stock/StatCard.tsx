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
  onClick?: () => void;
  isActive?: boolean;
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
  onClick,
  isActive,
}: StatCardProps) {
  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className="border-2 border-savannah-lime/30 bg-gradient-to-br from-background to-savannah-lime/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const cardContent = (
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            {title}
          </p>
          <p
            className={cn(
              'text-3xl font-bold tabular-nums transition-transform duration-300',
              'group-hover:scale-105 origin-left',
              styles.text
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            'bg-savannah-lime/20 text-savannah-lime',
            'transition-all duration-300',
            'group-hover:bg-savannah-lime group-hover:text-savannah-purple',
            'group-hover:scale-110 group-hover:rotate-3'
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </CardContent>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'group w-full text-left rounded-xl border-2 bg-gradient-to-br from-background to-savannah-lime/5',
          'transition-all duration-300 ease-out',
          'hover:shadow-lg hover:shadow-savannah-lime/20',
          'hover:-translate-y-1',
          'cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-savannah-lime focus:ring-offset-2',
          isActive
            ? 'border-savannah-lime ring-2 ring-savannah-lime/30 shadow-lg shadow-savannah-lime/20'
            : 'border-savannah-lime/30 hover:border-savannah-lime/60'
        )}
        aria-pressed={isActive}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Card
      className={cn(
        'group border-2 border-savannah-lime/30 bg-gradient-to-br from-background to-savannah-lime/5',
        'transition-all duration-300 ease-out',
        'hover:border-savannah-lime/60 hover:shadow-lg hover:shadow-savannah-lime/20',
        'hover:-translate-y-1',
        'cursor-default'
      )}
    >
      {cardContent}
    </Card>
  );
}
