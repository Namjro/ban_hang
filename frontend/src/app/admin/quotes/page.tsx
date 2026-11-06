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
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { QuoteRequest } from '@/lib/types';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/admin/quotes', { params });
      if (res.data.success) {
        setQuotes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load quotes', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleOpenDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setStatusInput(quote.status);
    setNotesInput(quote.admin_notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedQuote) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/quotes/${selectedQuote.id}/status`, {
        status: statusInput,
        admin_notes: notesInput,
      });
      if (res.data.success) {
        setSelectedQuote(res.data.data);
        fetchQuotes();
      }
    } catch (err) {
      console.error('Failed to update quote status', err);
      alert('Lỗi cập nhật trạng thái.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu báo giá này?')) return;
    try {
      await api.delete(`/admin/quotes/${id}`);
      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
      }
      fetchQuotes();
    } catch (err) {
      console.error('Failed to delete quote', err);
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
                          onClick={() => handleOpenDetail(q)}
                          className="p-1.5 text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors"
                          title="Xem chi tiết & Xử lý"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(q.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors"
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
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
          <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[580px] p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#94a3b8] uppercase">
                  YÊU CẦU BÁO GIÁ #{selectedQuote.id}
                </span>
                <h3 className="text-[18px] font-bold text-[#0b132b]">
                  {selectedQuote.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 rounded-[4px] hover:bg-[#f8fafc] text-[#475569]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-2 gap-4 text-[13px] bg-[#f8fafc] p-4 rounded-[6px] border border-[#dce2ea]">
              <div>
                <span className="text-[#94a3b8] text-[11px] block">Số điện thoại:</span>
                <span className="font-mono font-bold text-[#0b132b]">{selectedQuote.phone}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] text-[11px] block">Email:</span>
                <span className="text-[#0b132b]">{selectedQuote.email || 'Không có'}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] text-[11px] block">Công ty:</span>
                <span className="text-[#0b132b]">{selectedQuote.company_name || 'Khách cá nhân / Chưa rõ'}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] text-[11px] block">Nguồn tiếp nhận:</span>
                <span className="text-[#0b132b] font-medium">
                  {selectedQuote.source === 'landing_form' ? 'Landing Form' : 'Modal Liên Hệ'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#94a3b8] text-[11px] block">Mã SKU / Thông số quan tâm:</span>
                <span className="font-mono font-bold text-[#0b132b] bg-white px-2 py-1 rounded-[4px] border border-[#dce2ea] inline-block mt-0.5">
                  {selectedQuote.sku_target || 'Không nhập mã SKU'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#94a3b8] text-[11px] block">Nội dung yêu cầu từ khách:</span>
                <p className="text-[#0b132b] bg-white p-2.5 rounded-[4px] border border-[#dce2ea] mt-0.5 whitespace-pre-wrap">
                  {selectedQuote.requirement_content || 'Không có mô tả chi tiết'}
                </p>
              </div>
            </div>

            {/* Action / Status Update */}
            <div className="flex flex-col gap-3 border-t border-[#dce2ea] pt-3">
              <span className="text-[13px] font-bold text-[#0b132b]">
                Cập Nhật Tiến Độ Xử Lý
              </span>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-[#475569]">Chuyển trạng thái:</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] text-[#0b132b] focus:outline-none"
                >
                  <option value="new">Mới nhận (Chờ xử lý)</option>
                  <option value="contacted">Đã liên hệ điện thoại / Zalo</option>
                  <option value="quoted">Đã gửi bảng báo giá kỹ thuật</option>
                  <option value="completed">Đã chốt hợp đồng / Hoàn tất</option>
                  <option value="cancelled">Hủy yêu cầu</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-[#475569]">Ghi chú nội bộ admin:</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Ghi chú nhân viên báo giá, thời hạn giao hàng cam kết, chiết khấu..."
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] text-[#0b132b] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px]"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-medium flex items-center gap-1.5"
                >
                  {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
