'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import { quoteService } from '@/services';
import { getApiErrorMessage } from '@/lib/error-handler';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSku?: string;
}

export default function ContactModal({ isOpen, onClose, initialSku = '' }: ContactModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    email: '',
    sku_target: initialSku,
    requirement_content: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initialSku whenever the modal opens or initialSku prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        sku_target: initialSku || prev.sku_target,
      }));
      setErrorMsg('');
    }
  }, [isOpen, initialSku]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      setErrorMsg('Vui lòng nhập họ và tên cùng số điện thoại liên hệ.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await quoteService.submitQuoteRequest({
        full_name: formData.full_name,
        company_name: formData.company_name,
        phone: formData.phone,
        email: formData.email,
        sku_target: formData.sku_target || initialSku,
        requirement_content: formData.requirement_content,
        source: 'contact_modal',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, 'Lỗi gửi dữ liệu. Vui lòng kiểm tra lại.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[3px] animate-fade-in">
      <div
        className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[560px] p-6 sm:p-8 shadow-axiom-modal relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[#475569] text-[11px] font-semibold tracking-[1.6px] uppercase">
              LIÊN HỆ
            </span>
            <h3 className="text-[24px] sm:text-[28px] font-bold text-[#0b132b] tracking-[-1px] leading-tight">
              Nhập thông tin liên hệ
            </h3>
            <p className="text-[#475569] text-[13px] leading-relaxed">
              Để lại thông tin dưới đây để bộ phận kỹ thuật của chúng tôi liên hệ lại và hỗ trợ báo giá phù hợp.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[4px] bg-[#f8fafc] border border-[#dce2ea] hover:bg-[#dce2ea] text-[#0b132b] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h4 className="text-[18px] font-bold text-[#0b132b]">
              Gửi Yêu Cầu Thành Công!
            </h4>
            <p className="text-[13px] text-[#475569]">
              Cảm ơn bạn. Chuyên viên kỹ thuật AXIOM sẽ phản hồi ngay qua thông tin đã cung cấp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 border border-red-200 text-[12px] p-2.5 rounded-[4px]">
                {errorMsg}
              </div>
            )}

            {/* Row 1: Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-semibold text-[#0b132b]">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Họ và tên đầy đủ"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-semibold text-[#0b132b]">
                  Công ty
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Tên công ty / xưởng"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b]"
                />
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-semibold text-[#0b132b]">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-semibold text-[#0b132b]">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@congty.vn"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b]"
                />
              </div>
            </div>

            {/* SKU / Spec */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-[#0b132b]">
                SKU / Thông số kỹ thuật cần tìm
              </label>
              <input
                type="text"
                value={formData.sku_target}
                onChange={(e) => setFormData({ ...formData, sku_target: e.target.value })}
                placeholder="Vd: AX-PM-150 / phạm vi đo 0–150 mm"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-[#0b132b]">
                Nội dung yêu cầu
              </label>
              <textarea
                rows={3}
                value={formData.requirement_content}
                onChange={(e) => setFormData({ ...formData, requirement_content: e.target.value })}
                placeholder="Số lượng, ứng dụng, yêu cầu giao hàng, thời gian cần phản hồi…"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[16px] sm:text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-[#475569] text-center sm:text-left">
                Thông tin của bạn chỉ được dùng để phản hồi yêu cầu.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-[#0b132b] font-semibold text-[14px] h-[50px] px-6 rounded-[4px] flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi yêu cầu</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
