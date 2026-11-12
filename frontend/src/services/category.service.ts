import { api } from '@/lib/api';
import { ApiResponse, Category, CategoryPayload } from '@/lib/types';

export const categoryService = {
  async getPublicCategories(options?: { home?: boolean }): Promise<ApiResponse<Category[]>> {
    const params: Record<string, number> = {};
    if (options?.home) {
      params.home = 1;
    }
    const res = await api.get<ApiResponse<Category[]>>('/categories', { params });
    return res.data;
  },

  async getPublicCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    const res = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return res.data;
  },

  async getAdminCategories(search?: string): Promise<ApiResponse<Category[]>> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const res = await api.get<ApiResponse<Category[]>>('/admin/categories', { params });
    return res.data;
  },

  async createCategory(payload: CategoryPayload): Promise<ApiResponse<Category>> {
    const res = await api.post<ApiResponse<Category>>('/admin/categories', payload);
    return res.data;
  },

  async updateCategory(id: number, payload: CategoryPayload): Promise<ApiResponse<Category>> {
    const res = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
    return res.data;
  },

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/categories/${id}`);
    return res.data;
  },
};
