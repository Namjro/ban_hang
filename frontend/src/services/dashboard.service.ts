import { api } from '@/lib/api';
import { AdminStats, ApiResponse } from '@/lib/types';

export const dashboardService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    const res = await api.get<ApiResponse<AdminStats>>('/admin/dashboard/stats');
    return res.data;
  },
};
