import { api } from '@/lib/api';
import {
  ApiResponse,
  PaginatedApiResponse,
  QuoteFilterParams,
  QuoteRequest,
  QuoteRequestPayload,
  UpdateQuoteStatusPayload,
} from '@/lib/types';

export const quoteService = {
  async submitQuoteRequest(
    payload: QuoteRequestPayload
  ): Promise<ApiResponse<{ id: number; status: string; created_at: string }>> {
    const res = await api.post<ApiResponse<{ id: number; status: string; created_at: string }>>(
      '/quote-requests',
      payload
    );
    return res.data;
  },

  async getAdminQuotes(params: QuoteFilterParams = {}): Promise<PaginatedApiResponse<QuoteRequest>> {
    const queryParams: Record<string, string | number> = {};
    if (params.page) queryParams.page = params.page;
    if (params.per_page) queryParams.per_page = params.per_page;
    if (params.status) queryParams.status = params.status;
    if (params.search) queryParams.search = params.search;

    const res = await api.get<PaginatedApiResponse<QuoteRequest>>('/admin/quotes', {
      params: queryParams,
    });
    return res.data;
  },

  async updateQuoteStatus(
    id: number,
    payload: UpdateQuoteStatusPayload
  ): Promise<ApiResponse<QuoteRequest>> {
    const res = await api.patch<ApiResponse<QuoteRequest>>(`/admin/quotes/${id}/status`, payload);
    return res.data;
  },

  async deleteQuote(id: number): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/quotes/${id}`);
    return res.data;
  },
};
