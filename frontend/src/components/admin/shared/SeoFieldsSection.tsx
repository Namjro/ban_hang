'use client';

import React from 'react';
import { Sparkles, Globe } from 'lucide-react';

interface SeoFieldsSectionProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  onChangeMetaTitle: (value: string) => void;
  onChangeMetaDescription: (value: string) => void;
  onChangeMetaKeywords: (value: string) => void;
  onAutoGenerate: () => void;
  previewSlug: string;
  fallbackTitle: string;
  fallbackDescription: string;
}

export default function SeoFieldsSection({
  metaTitle,
  metaDescription,
  metaKeywords,
  onChangeMetaTitle,
  onChangeMetaDescription,
  onChangeMetaKeywords,
  onAutoGenerate,
  previewSlug,
  fallbackTitle,
  fallbackDescription,
}: SeoFieldsSectionProps) {
  const displayTitle = metaTitle.trim() || fallbackTitle || 'Tiêu đề SEO sản phẩm / danh mục';
  const displayDesc =
    metaDescription.trim() ||
    fallbackDescription ||
    'Mô tả ngắn gọn chuẩn SEO sẽ hiển thị trên kết quả tìm kiếm Google.';

  const titleLen = metaTitle.trim().length;
  const descLen = metaDescription.trim().length;

  return (
    <div className="border border-slate-200 rounded-[8px] bg-slate-50/70 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-[#0b132b] uppercase tracking-wider">
            Cấu hình SEO (Google Search & Chia sẻ)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Để trống nếu muốn hệ thống tự động sinh SEO khi lưu.
          </p>
        </div>

        <button
          type="button"
          onClick={onAutoGenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Tự động tạo SEO
        </button>
      </div>

      {/* Google Search Snippet Preview */}
      <div className="bg-white border border-slate-200 rounded-[6px] p-3.5 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">axiom-industrial.vn{previewSlug}</span>
        </div>
        <div className="text-[15px] font-medium text-[#1a0dab] leading-snug line-clamp-1">
          {displayTitle}
        </div>
        <div className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2">
          {displayDesc}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Meta Title (Tiêu đề SEO)
            </label>
            <span
              className={`text-[11px] font-mono ${
                titleLen > 70 ? 'text-amber-600 font-semibold' : 'text-slate-400'
              }`}
            >
              {titleLen}/70
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onChangeMetaTitle(e.target.value)}
            maxLength={255}
            placeholder="VD: Máy Phay CNC 5 Trục (AX-CNC-500) - Mazak"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Meta Description (Mô tả SEO)
            </label>
            <span
              className={`text-[11px] font-mono ${
                descLen > 160 ? 'text-amber-600 font-semibold' : 'text-slate-400'
              }`}
            >
              {descLen}/160
            </span>
          </div>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => onChangeMetaDescription(e.target.value)}
            maxLength={500}
            placeholder="Mô tả ngắn gọn thông số nổi bật, chứng từ CO/CQ, hỗ trợ báo giá B2B..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Meta Keywords (Từ khóa, cách nhau bởi dấu phẩy)
          </label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => onChangeMetaKeywords(e.target.value)}
            maxLength={500}
            placeholder="VD: máy phay cnc, AX-CNC-500, Mazak, thiết bị công nghiệp"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
