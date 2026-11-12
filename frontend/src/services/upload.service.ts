import { api } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

export const uploadService = {
  async uploadImages(
    files: File[],
    folder: 'products' | 'categories' | 'site' = 'site'
  ): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('folder', folder);

    const res = await api.post<ApiResponse<string[]>>('/admin/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async uploadDocument(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<ApiResponse<{ url: string }>>('/admin/uploads/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
