'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PhoneCall,
  Send,
  Loader2,
  Trash2,
  Eye,
} from 'lucide-react';
import { quoteService } from '@/services';
import { QuoteRequest, UpdateQuoteStatusPayload } from '@/lib/types';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useDebounce } from '@/hooks/useDebounce';
import QuoteDetailModal from '@/components/admin/QuoteDetailModal';
import { useToast } from '@/components/ui/Toast';

export default function AdminQuotesPage() {
  const toast = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteService.getAdminQuotes({
        status: statusFilter || undefined,
        search: debouncedSearchTerm || undefined,
      });
      if (res.success) {
        setQuotes(res.data);
      }
    } catch (err) {
      console.error('Failed to load quotes', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearchTerm]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleUpdateStatus = async (id: number, payload: UpdateQuoteStatusPayload) => {
    setUpdating(true);
    try {
      const res = await quoteService.updateQuoteStatus(id, payload);
      if (res.success) {
        setSelectedQuote(res.data);
        toast.success('Đã cập nhật trạng thái báo giá.');
        fetchQuotes();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Lỗi cập nhật trạng thái.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu báo giá này?')) return;
    try {
      await quoteService.deleteQuote(id);
      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
      }
      toast.success('Đã xóa yêu cầu báo giá.');
      fetchQuotes();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Lỗi khi xóa yêu cầu báo giá.'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#0b132b]">
          Quản Lý Yêu Cầu Báo Giá (Leads)
        </h1>
        <p className="text-[13px] text-[#475569]">
          Xử lý thông tin khách hàng B2B cần tìm nguồn và báo giá thiết bị cơ khí AXIOM.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-[320px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] focus-within:border-[#0b132b]">
          <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, SĐT, SKU..."
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#475569]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Lọc theo trạng thái"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b] focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">Mới nhận (Chưa xử lý)</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="quoted">Đã gửi báo giá</option>
            <option value="completed">Hoàn tất / Đã chốt đơn</option>
            <option value="cancelled">Hủy / Không phản hồi</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
            <span className="text-[13px] text-[#475569]">Đang tải danh sách yêu cầu...</span>
          </div>
        ) : quotes.length === 0 ? (
          <div className="p-16 text-center text-[#475569] text-[13px]">
            Không tìm thấy yêu cầu báo giá nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                <tr>
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-5">Khách Hàng / Công Ty</th>
                  <th className="py-3 px-5">Liên Hệ</th>
                  <th className="py-3 px-5">SKU / Yêu Cầu</th>
                  <th className="py-3 px-5">Trạng Thái</th>
                  <th className="py-3 px-5">Thời Gian</th>
                  <th className="py-3 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce2ea]">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-5 font-mono text-[#94a3b8]">#{q.id}</td>
                    <td className="py-3 px-5">
                      <div className="font-semibold text-[#0b132b]">{q.full_name}</div>
                      {q.company_name && (
                        <div className="text-[11px] text-[#475569]">{q.company_name}</div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-mono font-medium text-[#0b132b]">{q.phone}</div>
                      {q.email && <div className="text-[11px] text-[#475569]">{q.email}</div>}
                    </td>
                    <td className="py-3 px-5 max-w-[240px]">
                      {q.sku_target && (
                        <span className="font-mono bg-[#f8fafc] border border-[#dce2ea] px-1.5 py-0.5 rounded-[2px] text-[11px] font-semibold text-[#0b132b] block truncate mb-0.5">
                          {q.sku_target}
                        </span>
                      )}
                      <span className="text-[12px] text-[#475569] line-clamp-1">
                        {q.requirement_content || 'Không ghi chú thêm'}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      {q.status === 'new' ? (
                        <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Mới
                        </span>
                      ) : q.status === 'contacted' ? (
                        <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] inline-flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> Đã gọi
                        </span>
                      ) : q.status === 'quoted' ? (
                        <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] inline-flex items-center gap-1">
                          <Send className="w-3 h-3" /> Đã báo giá
                        </span>
                      ) : q.status === 'completed' ? (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Hoàn tất
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-[2px] text-[11px]">
                          Hủy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-[#94a3b8] text-[12px] whitespace-nowrap">
                      {new Date(q.created_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-1.5 text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors cursor-pointer"
                          title="Xem chi tiết & Xử lý"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(q.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      <QuoteDetailModal
        quote={selectedQuote}
        updating={updating}
        onClose={() => setSelectedQuote(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
