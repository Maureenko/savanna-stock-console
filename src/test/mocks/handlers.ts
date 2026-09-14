import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://dummyjson.com';

// Mock product data
const mockProducts = [
  {
    id: 1,
    title: 'Test Product 1',
    description: 'Test description',
    price: 9.99,
    stock: 100,
    category: 'groceries',
    thumbnail: 'https://example.com/image.jpg',
    brand: 'TestBrand',
    rating: 4.5,
    availabilityStatus: 'In Stock',
  },
  {
    id: 2,
    title: 'Test Product 2',
    description: 'Another description',
    price: 19.99,
    stock: 5,
    category: 'beauty',
    thumbnail: 'https://example.com/image2.jpg',
    brand: 'TestBrand2',
    rating: 3.8,
    availabilityStatus: 'Low Stock',
  },
];

// Mock auth tokens
let currentToken = 'test-access-token';
const refreshToken = 'test-refresh-token';

export const handlers = [
  // Auth: Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string };

    if (body.username === 'emilys' && body.password === 'emilyspass') {
      return HttpResponse.json({
        accessToken: currentToken,
        refreshToken: refreshToken,
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@example.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        image: 'https://example.com/avatar.jpg',
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Auth: Refresh token
  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (body.refreshToken === refreshToken) {
      currentToken = 'new-access-token';
      return HttpResponse.json({
        accessToken: currentToken,
        refreshToken: refreshToken,
      });
    }

    return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
  }),

  // Products: Get all
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    const skip = Number(url.searchParams.get('skip')) || 0;

    return HttpResponse.json({
      products: mockProducts.slice(skip, skip + limit),
      total: mockProducts.length,
      skip,
      limit,
    });
  }),

  // Products: Search
  http.get(`${BASE_URL}/products/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const limit = Number(url.searchParams.get('limit')) || 10;
    const skip = Number(url.searchParams.get('skip')) || 0;

    const filtered = mockProducts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

    return HttpResponse.json({
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit,
    });
  }),

  // Products: Get by category
  http.get(`${BASE_URL}/products/category/:category`, ({ params, request }) => {
    const { category } = params;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;
    const skip = Number(url.searchParams.get('skip')) || 0;

    const filtered = mockProducts.filter((p) => p.category === category);

    return HttpResponse.json({
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit,
    });
  }),

  // Products: Get single
  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const id = Number(params.id);
    const product = mockProducts.find((p) => p.id === id);

    if (product) {
      return HttpResponse.json(product);
    }

    return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
  }),

  // Products: Update (stock correction)
  http.put(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { stock: number };
    const product = mockProducts.find((p) => p.id === id);

    if (product) {
      // DummyJSON returns partial data on PUT
      return HttpResponse.json({
        id,
        stock: body.stock,
      });
    }

    return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
  }),

  // Categories
  http.get(`${BASE_URL}/products/categories`, () => {
    return HttpResponse.json([
      { slug: 'groceries', name: 'Groceries', url: '' },
      { slug: 'beauty', name: 'Beauty', url: '' },
    ]);
  }),
];
