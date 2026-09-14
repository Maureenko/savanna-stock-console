export interface ActivityLogEntry {
  id: string;
  productId?: number;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'stock_correction';
  previousValue: number;
  newValue: number;
  reason?: string;
}
