import { api } from '@/lib/api';
import { ApiResponse, SiteSettingGroup, SiteSettings } from '@/lib/types';

export const settingsService = {
  async getPublicSettings(): Promise<ApiResponse<SiteSettings>> {
    const res = await api.get<ApiResponse<SiteSettings>>('/settings');
    return res.data;
  },

  async getAdminGroup<K extends SiteSettingGroup>(group: K): Promise<ApiResponse<SiteSettings[K]>> {
    const res = await api.get<ApiResponse<SiteSettings[K]>>(`/admin/settings/${group}`);
    return res.data;
  },

  async updateAdminGroup<K extends SiteSettingGroup>(
    group: K,
    payload: SiteSettings[K]
  ): Promise<ApiResponse<SiteSettings[K]>> {
    const res = await api.put<ApiResponse<SiteSettings[K]>>(`/admin/settings/${group}`, payload);
    return res.data;
  },
};
