import apiClient from '@/lib/axios';
import type {
  Category,
  Product,
  ProductsQueryParams,
  ProductsResponse,
  UpdateProductData,
} from '@/types/product';

/**
 * Build query string from params object
 */
const buildQueryString = (params: ProductsQueryParams & { q?: string }): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Get paginated list of products with optional sorting
 */
export const getProducts = async (
  params: ProductsQueryParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get<ProductsResponse>(`/products${queryString}`, { signal });
  return response.data;
};

/**
 * Get a single product by ID
 */
export const getProduct = async (id: number, signal?: AbortSignal): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`, { signal });
  return response.data;
};

/**
 * Search products by query string
 */
export const searchProducts = async (
  query: string,
  params: ProductsQueryParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  const allParams = { q: query, ...params };
  const queryString = buildQueryString(allParams);
  const response = await apiClient.get<ProductsResponse>(`/products/search${queryString}`, {
    signal,
  });
  return response.data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categorySlug: string,
  params: ProductsQueryParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  const queryString = buildQueryString(params);
  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${categorySlug}${queryString}`,
    { signal }
  );
  return response.data;
};

/**
 * Get all product categories
 */
export const getCategories = async (signal?: AbortSignal): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/products/categories', {
    signal,
  });
  return response.data;
};

/**
 * Update a product (e.g., stock correction)
 * Note: DummyJSON simulates this - changes won't persist on the server
 */
export const updateProduct = async (id: number, data: UpdateProductData): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
};
