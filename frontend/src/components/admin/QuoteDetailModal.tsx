'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { QuoteRequest, QuoteStatus, UpdateQuoteStatusPayload } from '@/lib/types';
import SelectField from '@/components/ui/SelectField';

interface QuoteDetailModalProps {
  quote: QuoteRequest | null;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, payload: UpdateQuoteStatusPayload) => Promise<void>;
}

export default function QuoteDetailModal({
  quote,
  updating,
  onClose,
  onUpdateStatus,
}: QuoteDetailModalProps) {
  const [statusInput, setStatusInput] = useState<QuoteStatus>('new');
  const [notesInput, setNotesInput] = useState('');

  useEffect(() => {
    if (quote) {
      setStatusInput(quote.status);
      setNotesInput(quote.admin_notes || '');
    }
  }, [quote]);

  if (!quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
      <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[580px] p-4 sm:p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3 gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-[#94a3b8] uppercase">
              YÊU CẦU BÁO GIÁ #{quote.id}
            </span>
            <h3 className="text-[18px] font-bold text-[#0b132b] truncate">{quote.full_name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng chi tiết báo giá"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f8fafc] text-[#475569] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-[13px] bg-[#f8fafc] p-3.5 sm:p-4 rounded-[6px] border border-[#dce2ea]">
          <div>
            <span className="text-[#94a3b8] text-[11px] block">Số điện thoại:</span>
            <a href={`tel:${quote.phone}`} className="font-mono font-bold text-[#0b132b] underline decoration-[#dce2ea]">
              {quote.phone}
            </a>
          </div>
          <div className="min-w-0">
            <span className="text-[#94a3b8] text-[11px] block">Email:</span>
            <span className="text-[#0b132b] break-words">{quote.email || 'Không có'}</span>
          </div>
          <div>
            <span className="text-[#94a3b8] text-[11px] block">Công ty:</span>
            <span className="text-[#0b132b]">
              {quote.company_name || 'Khách cá nhân / Chưa rõ'}
            </span>
          </div>
          <div>
            <span className="text-[#94a3b8] text-[11px] block">Nguồn tiếp nhận:</span>
            <span className="text-[#0b132b] font-medium">
              {quote.source === 'landing_form' ? 'Landing Form' : 'Modal Liên Hệ'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#94a3b8] text-[11px] block">Mã SKU / Thông số quan tâm:</span>
            <span className="font-mono font-bold text-[#0b132b] bg-white px-2 py-1 rounded-[4px] border border-[#dce2ea] inline-block mt-0.5 break-all">
              {quote.sku_target || 'Không nhập mã SKU'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#94a3b8] text-[11px] block">Nội dung yêu cầu từ khách:</span>
            <p className="text-[#0b132b] bg-white p-2.5 rounded-[4px] border border-[#dce2ea] mt-0.5 whitespace-pre-wrap break-words">
              {quote.requirement_content || 'Không có mô tả chi tiết'}
            </p>
          </div>
        </div>

        {/* Action / Status Update */}
        <div className="flex flex-col gap-3 border-t border-[#dce2ea] pt-3">
          <span className="text-[13px] font-bold text-[#0b132b]">Cập Nhật Tiến Độ Xử Lý</span>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[12px] text-[#475569]">Chuyển trạng thái:</label>
            <SelectField
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value as QuoteStatus)}
            >
              <option value="new">Mới nhận (Chờ xử lý)</option>
              <option value="contacted">Đã liên hệ điện thoại / Zalo</option>
              <option value="quoted">Đã gửi bảng báo giá kỹ thuật</option>
              <option value="completed">Đã chốt hợp đồng / Hoàn tất</option>
              <option value="cancelled">Hủy yêu cầu</option>
            </SelectField>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#475569]">Ghi chú nội bộ admin:</label>
            <textarea
              rows={2}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Ghi chú nhân viên báo giá, thời hạn giao hàng cam kết, chiết khấu..."
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] text-[#0b132b] focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onUpdateStatus(quote.id, {
                  status: statusInput,
                  admin_notes: notesInput,
                })
              }
              className="px-4 py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
