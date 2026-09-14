import type { ActivityLogEntry } from '@/types/activity';

type Listener = () => void;

// Cached empty array to ensure stable reference for useSyncExternalStore
const EMPTY_ENTRIES: ActivityLogEntry[] = [];

// Simple in-memory store for real-time activity updates
class ActivityStore {
  private entries: Map<number, ActivityLogEntry[]> = new Map();
  private listeners: Set<Listener> = new Set();

  addEntry(productId: number, entry: ActivityLogEntry) {
    const existing = this.entries.get(productId) || [];
    this.entries.set(productId, [entry, ...existing]);
    this.notifyListeners();
  }

  getEntries(productId: number): ActivityLogEntry[] {
    return this.entries.get(productId) ?? EMPTY_ENTRIES;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const activityStore = new ActivityStore();

// Helper to create a new activity entry
export function createActivityEntry(
  productId: number,
  previousValue: number,
  newValue: number,
  userName: string
): ActivityLogEntry {
  return {
    id: `live-${Date.now()}`,
    productId,
    timestamp: new Date(),
    userId: 'current-user',
    userName,
    action: 'stock_correction',
    previousValue,
    newValue,
    reason: 'Manual stock correction',
  };
}
