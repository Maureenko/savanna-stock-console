import type { ActivityLogEntry } from '@/types/activity';

// Fixed user list for consistent mock data
const MOCK_USERS = [
  { id: 'user-1', name: 'Dr. Sarah M.' },
  { id: 'user-2', name: 'Nurse John K.' },
  { id: 'user-3', name: 'Admin User' },
  { id: 'user-4', name: 'Pharmacist Grace O.' },
  { id: 'user-5', name: 'Dr. Peter N.' },
];

// Reasons for stock adjustments
const ADJUSTMENT_REASONS = [
  'Physical count adjustment',
  'Received shipment',
  'Damaged goods removed',
  'Expired items disposed',
  'Inventory reconciliation',
  'Stock transfer from warehouse',
  'Emergency restock',
  undefined, // No reason provided
];

/**
 * Simple seeded random number generator for deterministic results
 * Uses a Linear Congruential Generator (LCG)
 */
function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

/**
 * Generate mock activity log entries for a product
 * Uses productId as seed for deterministic results (same product = same history)
 */
export function generateMockActivity(productId: number, currentStock: number): ActivityLogEntry[] {
  const random = createSeededRandom(productId * 12345);

  // Generate 3-5 entries based on productId
  const entryCount = 3 + Math.floor(random() * 3);
  const entries: ActivityLogEntry[] = [];

  // Work backwards from current stock to create realistic history
  let stockValue = currentStock;
  const now = new Date();

  for (let i = 0; i < entryCount; i++) {
    // Days ago (spread over past 30 days)
    const daysAgo = Math.floor(random() * 7) + i * 7 + 1;
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(random() * 10) + 8); // 8am - 6pm
    timestamp.setMinutes(Math.floor(random() * 60));

    // Select user deterministically
    const user = MOCK_USERS[Math.floor(random() * MOCK_USERS.length)];

    // Calculate previous value (work backwards)
    const changeDirection = random() > 0.5 ? 1 : -1;
    const changeAmount = Math.floor(random() * 15) + 1;
    const previousValue = Math.max(0, stockValue + changeDirection * changeAmount);

    // Select reason (sometimes undefined)
    const reason = ADJUSTMENT_REASONS[Math.floor(random() * ADJUSTMENT_REASONS.length)];

    entries.push({
      id: `activity-${productId}-${i}`,
      timestamp,
      userId: user.id,
      userName: user.name,
      action: 'stock_correction',
      previousValue,
      newValue: stockValue,
      reason,
    });

    // Update stock value for next iteration (going further back in time)
    stockValue = previousValue;
  }

  // Sort by timestamp descending (most recent first)
  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Format relative time from a date
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  // For older dates, show the actual date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
