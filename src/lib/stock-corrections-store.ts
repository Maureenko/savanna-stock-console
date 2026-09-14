type Listener = () => void;

// Store for local stock corrections that "persist" within the session
// Since DummyJSON doesn't actually save changes, we store them locally
class StockCorrectionsStore {
  private corrections: Map<number, number> = new Map();
  private listeners: Set<Listener> = new Set();
  private version: number = 0;

  setCorrection(productId: number, stock: number) {
    this.corrections.set(productId, stock);
    this.version++; // Increment version on every change
    this.notifyListeners();
  }

  getCorrection(productId: number): number | undefined {
    return this.corrections.get(productId);
  }

  hasCorrection(productId: number): boolean {
    return this.corrections.has(productId);
  }

  getAllCorrections(): Map<number, number> {
    return new Map(this.corrections);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): Map<number, number> {
    return this.corrections;
  }

  getVersion(): number {
    return this.version;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const stockCorrectionsStore = new StockCorrectionsStore();

// Helper to apply local corrections to a product
export function applyStockCorrection<T extends { id: number; stock: number }>(product: T): T {
  const correction = stockCorrectionsStore.getCorrection(product.id);
  if (correction !== undefined) {
    return { ...product, stock: correction };
  }
  return product;
}

// Helper to apply local corrections to an array of products
export function applyStockCorrections<T extends { id: number; stock: number }>(products: T[]): T[] {
  return products.map(applyStockCorrection);
}
