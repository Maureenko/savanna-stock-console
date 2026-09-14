import { delay, http, HttpResponse } from 'msw';

import type { ProductsResponse } from '@/types/product';

/**
 * Generate mock products for a search query
 */
function generateMockProducts(query: string, count: number = 5): ProductsResponse {
  const products = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${query} Product ${i + 1}`,
    description: `This is a test product matching "${query}"`,
    price: 10 + i * 5,
    discountPercentage: 0,
    rating: 4.5,
    stock: 50 + i * 10,
    brand: 'Test Brand',
    category: 'test-category',
    thumbnail: 'https://example.com/thumb.jpg',
    images: ['https://example.com/img.jpg'],
    availabilityStatus: 'In Stock',
    sku: `SKU-${query.toUpperCase()}-${i}`,
    minimumOrderQuantity: 1,
    shippingInformation: 'Ships in 2-3 days',
    warrantyInformation: '1 year warranty',
    returnPolicy: '30 day returns',
    dimensions: { width: 10, height: 10, depth: 10 },
    weight: 1,
    tags: ['test'],
    reviews: [],
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      barcode: '123456789',
      qrCode: 'https://example.com/qr',
    },
  }));

  return {
    products,
    total: count,
    skip: 0,
    limit: 10,
  };
}

/**
 * Default handlers for MSW
 * These can be overridden in individual tests using server.use()
 */
export const handlers = [
  // Products search endpoint
  http.get('https://dummyjson.com/products/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    // Default: respond immediately
    return HttpResponse.json(generateMockProducts(query));
  }),

  // Products list endpoint
  http.get('https://dummyjson.com/products', async () => {
    return HttpResponse.json(generateMockProducts('default', 10));
  }),

  // Products by category endpoint
  http.get('https://dummyjson.com/products/category/:category', async ({ params }) => {
    const category = params.category as string;
    return HttpResponse.json(generateMockProducts(category, 8));
  }),

  // Single product endpoint
  http.get('https://dummyjson.com/products/:id', async ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json({
      id,
      title: `Product ${id}`,
      description: 'Test product description',
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      brand: 'Test Brand',
      category: 'test-category',
      thumbnail: 'https://example.com/thumb.jpg',
      images: ['https://example.com/img.jpg'],
      availabilityStatus: 'In Stock',
      sku: `SKU-${id}`,
      minimumOrderQuantity: 1,
      shippingInformation: 'Ships in 2-3 days',
      warrantyInformation: '1 year warranty',
      returnPolicy: '30 day returns',
      dimensions: { width: 10, height: 10, depth: 10 },
      weight: 1,
      tags: ['test'],
      reviews: [],
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        barcode: '123456789',
        qrCode: 'https://example.com/qr',
      },
    });
  }),

  // Categories endpoint
  http.get('https://dummyjson.com/products/categories', async () => {
    return HttpResponse.json([
      { slug: 'electronics', name: 'Electronics', url: '' },
      { slug: 'clothing', name: 'Clothing', url: '' },
      { slug: 'furniture', name: 'Furniture', url: '' },
    ]);
  }),

  // Update product endpoint
  http.put('https://dummyjson.com/products/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id,
      title: `Product ${id}`,
      description: 'Test product description',
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: body.stock ?? 50,
      brand: 'Test Brand',
      category: 'test-category',
      thumbnail: 'https://example.com/thumb.jpg',
      images: ['https://example.com/img.jpg'],
      availabilityStatus: 'In Stock',
      sku: `SKU-${id}`,
      minimumOrderQuantity: 1,
      shippingInformation: 'Ships in 2-3 days',
      warrantyInformation: '1 year warranty',
      returnPolicy: '30 day returns',
      dimensions: { width: 10, height: 10, depth: 10 },
      weight: 1,
      tags: ['test'],
      reviews: [],
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        barcode: '123456789',
        qrCode: 'https://example.com/qr',
      },
    });
  }),

  // Auth endpoints
  http.post('https://dummyjson.com/auth/login', async () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }),

  http.post('https://dummyjson.com/auth/refresh', async () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }),

  http.get('https://dummyjson.com/auth/me', async () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  }),
];

// Export helper for creating delayed search responses
export { generateMockProducts, delay };
