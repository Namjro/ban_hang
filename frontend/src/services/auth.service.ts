import { api } from '@/lib/api';
import { AuthResponse, User } from '@/lib/types';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await api.post<{ success: boolean; message: string }>('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },

  async refresh(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/refresh');
    return res.data;
  },
};
