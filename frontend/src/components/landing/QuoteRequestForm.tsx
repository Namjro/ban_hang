'use client';

import React, { useState } from 'react';
import { Check, Phone, MessageSquare, ArrowUpRight, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { quoteService } from '@/services';
import { getApiErrorMessage } from '@/lib/error-handler';
import { COMPANY_INFO } from '@/constants';

export default function QuoteRequestForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company_name: '',
    sku_target: '',
    requirement_content: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      setErrorMsg('Vui lòng nhập họ tên và số điện thoại.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await quoteService.submitQuoteRequest({
        full_name: formData.full_name,
        phone: formData.phone,
        company_name: formData.company_name,
        sku_target: formData.sku_target,
        requirement_content: formData.requirement_content,
        source: 'landing_form',
      });

      setSubmitted(true);
      setFormData({
        full_name: '',
        phone: '',
        company_name: '',
        sku_target: '',
        requirement_content: '',
      });
    } catch (err) {
      setErrorMsg(
        getApiErrorMessage(err, 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại hoặc gọi Hotline.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote-request" className="bg-[#0b132b] text-white py-16 lg:py-[80px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center gap-12 lg:gap-[96px]">
        {/* Left Column: Proposition and direct hotline */}
        <div className="flex-1 max-w-[620px] flex flex-col gap-6">
          <span className="text-[#94a3b8] text-[11px] font-semibold tracking-[1.6px] uppercase">
            04 / LỢI THẾ SẢN XUẤT TIẾP THEO CỦA BẠN
          </span>

          <h2 className="text-[34px] sm:text-[44px] font-bold text-white tracking-[-1.5px] leading-[1.1]">
            Thông số của bạn. <br />Năng lực tìm nguồn của chúng tôi.
          </h2>

          <p className="text-[#e8edf3] text-[15px] leading-[1.65]">
            Cho chúng tôi biết nhu cầu sản xuất của bạn. Nhận báo giá chi tiết kèm thông tin tồn kho, thời gian giao hàng và tài liệu kỹ thuật phù hợp.
          </p>

          <div className="flex flex-col gap-3">
            {[
              'Chuyên gia kỹ thuật phản hồi, không phải thư trả lời chung chung',
              'Báo giá chi tiết từng hạng mục và xác nhận tồn kho',
              'Không ràng buộc. Không trao đổi qua lại không cần thiết.',
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-[2px] bg-[#152039] flex items-center justify-center text-[#f59e0b] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[#e8edf3] text-[13px]">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Direct contact chips */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-[#94a3b8] text-[12px]">Muốn trao đổi trực tiếp?</span>
            <div className="flex flex-wrap gap-3">
              <a
                href={COMPANY_INFO.hotlineTel}
                className="border border-[#475569] hover:border-[#f59e0b] px-3.5 py-2.5 rounded-[4px] flex items-center gap-2 text-white text-[12px] font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f59e0b]" />
                <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
              </a>
              <a
                href={COMPANY_INFO.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[#475569] hover:border-[#f59e0b] px-3.5 py-2.5 rounded-[4px] flex items-center gap-2 text-white text-[12px] font-medium transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#10b981]" />
                <span>Zalo: Axiom Supply</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: B2B Lead Form */}
        <div className="w-full lg:w-[560px] bg-white text-[#0b132b] rounded-[8px] p-6 sm:p-8 shadow-xl flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[22px] font-bold text-[#0b132b] tracking-[-0.5px]">
              Nhận báo giá cho nhu cầu của bạn.
            </h3>
            <p className="text-[#475569] text-[12px]">
              Điền thông tin bên dưới để được tư vấn kỹ thuật và nhận báo giá trong 2h.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-[6px] p-6 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              <h4 className="text-[16px] font-bold text-emerald-800">
                Gửi Yêu Cầu Báo Giá Thành Công!
              </h4>
              <p className="text-[13px] text-emerald-700 leading-relaxed">
                Kỹ sư kỹ thuật của AXIOM đã tiếp nhận thông tin và sẽ liên hệ qua điện thoại/Zalo để gửi báo giá chi tiết.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-[13px] text-emerald-800 underline font-medium hover:text-emerald-900 cursor-pointer"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-[12px] p-3 rounded-[4px]">
                  {errorMsg}
                </div>
              )}

              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#0b132b]">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Họ và tên đầy đủ của bạn"
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b] focus:ring-1 focus:ring-[#0b132b]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#0b132b]">
                    Điện thoại / Công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Số điện thoại liên hệ"
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b] focus:ring-1 focus:ring-[#0b132b]"
                  />
                </div>
              </div>

              {/* SKU / Spec */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#0b132b]">
                  SKU / Thông Số Kỹ Thuật Cần Tìm
                </label>
                <input
                  type="text"
                  value={formData.sku_target}
                  onChange={(e) => setFormData({ ...formData, sku_target: e.target.value })}
                  placeholder="Vd: AX-PM-150 / phạm vi đo 0–150 mm / Dao phay Ø10"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b] focus:ring-1 focus:ring-[#0b132b]"
                />
              </div>

              {/* Content textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#0b132b]">
                  Nội Dung Yêu Cầu
                </label>
                <textarea
                  rows={3}
                  value={formData.requirement_content}
                  onChange={(e) => setFormData({ ...formData, requirement_content: e.target.value })}
                  placeholder="Số lượng, ứng dụng gia công, yêu cầu thời gian giao hàng…"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#0b132b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b132b] focus:ring-1 focus:ring-[#0b132b] resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-[#0b132b] font-medium text-[14px] h-[50px] px-5 rounded-[4px] flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <span>Nhận Báo Giá Ngay</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[#475569] text-[11px] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#94a3b8]" />
                <span>Thông tin của bạn chỉ được dùng để phản hồi yêu cầu kỹ thuật.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
