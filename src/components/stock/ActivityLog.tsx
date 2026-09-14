'use client';

import { ArrowRight, Clock, History } from 'lucide-react';
import { useMemo, useState, useSyncExternalStore } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityStore } from '@/lib/activity-store';
import { formatRelativeTime, generateMockActivity, getInitials } from '@/lib/mock-activity';
import { cn } from '@/lib/utils';
import type { ActivityLogEntry } from '@/types/activity';

interface ActivityLogProps {
  productId: number;
  currentStock: number;
  compact?: boolean;
}

// Avatar colors based on user ID for consistency
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];

function getAvatarColor(userId: string): string {
  const index = userId.charCodeAt(userId.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function ActivityEntry({
  entry,
  compact,
  isNew,
}: {
  entry: ActivityLogEntry;
  compact?: boolean;
  isNew?: boolean;
}) {
  const initials = getInitials(entry.userName);
  const avatarColor = getAvatarColor(entry.userId);
  const stockIncreased = entry.newValue > entry.previousValue;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 transition-colors',
          isNew && 'bg-savannah-lime/20 -mx-3 px-3 rounded'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-medium text-white',
            avatarColor
          )}
          aria-hidden="true"
        >
          {initials}
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate text-xs font-medium">{entry.userName}</span>
            {isNew && (
              <span className="text-[0.5625rem] bg-savannah-lime text-savannah-purple px-1 rounded font-medium">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs shrink-0">
            <span className="tabular-nums text-muted-foreground">{entry.previousValue}</span>
            <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" aria-hidden="true" />
            <span
              className={cn(
                'font-semibold tabular-nums',
                stockIncreased ? 'text-success' : 'text-destructive'
              )}
            >
              {entry.newValue}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-3 transition-colors',
        isNew && 'bg-savannah-lime/10 -mx-4 px-4 rounded-lg'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white',
          avatarColor
        )}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{entry.userName}</span>
          {isNew && (
            <span className="text-[0.625rem] bg-savannah-lime text-savannah-purple px-1.5 py-0.5 rounded font-medium">
              NEW
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            <Clock className="mr-1 inline-block h-3 w-3" aria-hidden="true" />
            {formatRelativeTime(entry.timestamp)}
          </span>
        </div>

        {/* Stock change */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Stock adjusted:</span>
          <span className="font-medium tabular-nums">{entry.previousValue}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <span
            className={cn(
              'font-semibold tabular-nums',
              stockIncreased ? 'text-success' : 'text-destructive'
            )}
          >
            {entry.newValue}
          </span>
          <span className={cn('text-xs', stockIncreased ? 'text-success' : 'text-destructive')}>
            ({stockIncreased ? '+' : ''}
            {entry.newValue - entry.previousValue})
          </span>
        </div>

        {/* Reason if present */}
        {entry.reason && (
          <p className="text-xs text-muted-foreground italic">&ldquo;{entry.reason}&rdquo;</p>
        )}
      </div>
    </div>
  );
}

// Cached empty array for server snapshot to ensure stable reference
const SERVER_SNAPSHOT: ActivityLogEntry[] = [];

// Custom hook to subscribe to activity store
function useLiveActivities(productId: number) {
  return useSyncExternalStore(
    activityStore.subscribe.bind(activityStore),
    () => activityStore.getEntries(productId),
    () => SERVER_SNAPSHOT
  );
}

export function ActivityLog({ productId, currentStock, compact }: ActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get live activities from store
  const liveActivities = useLiveActivities(productId);

  // Generate deterministic mock activity based on productId
  const mockActivities = useMemo(
    () => generateMockActivity(productId, currentStock),
    [productId, currentStock]
  );

  // Combine live activities (first) with mock activities
  const activities = useMemo(
    () => [...liveActivities, ...mockActivities],
    [liveActivities, mockActivities]
  );

  // Track which entries are "new" (live entries)
  const liveIds = useMemo(() => new Set(liveActivities.map((a) => a.id)), [liveActivities]);

  if (compact) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold">
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            Activity Log
          </h3>
          <span className="text-[0.625rem] text-muted-foreground">{activities.length} entries</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <div className="divide-y divide-border">
            {activities.map((entry) => (
              <ActivityEntry key={entry.id} entry={entry} compact isNew={liveIds.has(entry.id)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-expanded={isExpanded}
          aria-controls="activity-log-content"
        >
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" aria-hidden="true" />
            Activity Log
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {isExpanded ? 'Hide' : 'Show'} ({activities.length} entries)
          </span>
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent id="activity-log-content" className="pt-0">
          <div className="divide-y divide-border">
            {activities.map((entry) => (
              <ActivityEntry key={entry.id} entry={entry} isNew={liveIds.has(entry.id)} />
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-xs text-muted-foreground">
            <strong>Note:</strong> Historical data is simulated for demonstration. New corrections
            appear at the top in real-time.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
