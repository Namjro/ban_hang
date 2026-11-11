import { api } from '@/lib/api';
import {
  AdminProductFilterParams,
  ApiResponse,
  PaginatedApiResponse,
  Product,
  ProductDetailResponse,
  ProductFilterParams,
  ProductPayload,
} from '@/lib/types';

export const productService = {
  async getPublicProducts(params: ProductFilterParams = {}): Promise<PaginatedApiResponse<Product>> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.per_page) queryParams.per_page = params.per_page;
    if (params.search) queryParams.search = params.search;
    if (params.category) queryParams.category = params.category;
    if (params.brand) queryParams.brand = params.brand;
    if (params.stock_status) queryParams.stock_status = params.stock_status;
    if (params.featured !== undefined) queryParams.featured = params.featured;
    if (params.sort_by) queryParams.sort_by = params.sort_by;
    if (params.sort_order) queryParams.sort_order = params.sort_order;

    const res = await api.get<PaginatedApiResponse<Product>>('/products', { params: queryParams });
    return res.data;
  },

  async getPublicProductBySlug(slug: string): Promise<ProductDetailResponse> {
    const res = await api.get<ProductDetailResponse>(`/products/${slug}`);
    return res.data;
  },

  async getQuickSpecs(): Promise<ApiResponse<Product[]>> {
    const res = await api.get<ApiResponse<Product[]>>('/products/quick-specs');
    return res.data;
  },

  async getAdminProducts(params: AdminProductFilterParams = {}): Promise<PaginatedApiResponse<Product>> {
    const queryParams: Record<string, string | number> = {};
    if (params.page) queryParams.page = params.page;
    if (params.per_page) queryParams.per_page = params.per_page;
    if (params.search) queryParams.search = params.search;
    if (params.category_id) queryParams.category_id = params.category_id;
    if (params.stock_status) queryParams.stock_status = params.stock_status;

    const res = await api.get<PaginatedApiResponse<Product>>('/admin/products', { params: queryParams });
    return res.data;
  },

  async createProduct(payload: ProductPayload): Promise<ApiResponse<Product>> {
    const res = await api.post<ApiResponse<Product>>('/admin/products', payload);
    return res.data;
  },

  async updateProduct(id: number, payload: ProductPayload): Promise<ApiResponse<Product>> {
    const res = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, payload);
    return res.data;
  },

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`);
    return res.data;
  },

  async uploadImages(files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });

    const res = await api.post<ApiResponse<string[]>>('/admin/products/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
