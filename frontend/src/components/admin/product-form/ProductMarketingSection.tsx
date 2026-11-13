'use client';

import React, { useState } from 'react';
import { Star, Home, FileText, Upload, Loader2, ExternalLink, X } from 'lucide-react';
import RepeatableStringList from '@/components/admin/shared/RepeatableStringList';
import SeoFieldsSection from '@/components/admin/shared/SeoFieldsSection';
import { generateProductSeoFallback } from '@/lib/seo';
import { uploadService } from '@/services';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/error-handler';
import { ProductFormState } from './types';

interface ProductMarketingSectionProps {
  form: ProductFormState;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductMarketingSection({
  form,
  onChange,
}: ProductMarketingSectionProps) {
  const toast = useToast();
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const fallback = generateProductSeoFallback({
    name: form.name,
    sku: form.sku,
    brand: form.brand,
    spec_summary: form.spec_summary,
    description: form.description,
  });

  const handleAutoGenerateSeo = () => {
    onChange({
      meta_title: fallback.meta_title,
      meta_description: fallback.meta_description,
      meta_keywords: fallback.meta_keywords,
    });
  };

  const handleUploadDatasheet = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    try {
      const res = await uploadService.uploadDocument(file);
      if (res.success && res.data?.url) {
        onChange({ datasheet_url: res.data.url });
        toast.success('Đã tải tài liệu PDF lên thành công.');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Không thể tải lên tệp PDF.'));
    } finally {
      setIsUploadingPdf(false);
      e.target.value = '';
    }
  };

  return (
    <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-5">
      {/* Cấu hình hiển thị Trang chủ Public */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#dce2ea] pb-2">
          <Home className="w-4 h-4 text-[#0b132b]" />
          <h3 className="text-[13px] font-bold text-[#0b132b] uppercase tracking-wide">
            Cấu hình Hiển thị Trang Chủ Public (Mục 01 & Mục 02)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Mục 01: Sản phẩm tiêu biểu */}
          <div className="bg-white border border-[#dce2ea] rounded-[6px] p-3.5 flex flex-col gap-3 shadow-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_on_home}
                onChange={(e) => onChange({ show_on_home: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-[#0b132b]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#0b132b] flex items-center gap-1.5">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                    Mục 01
                  </span>
                  Hiển thị ở Sản Phẩm Tiêu Biểu
                </span>
                <span className="text-[11px] text-[#64748b] mt-0.5">
                  Đưa sản phẩm lên lưới thẻ Mục 01 ngoài trang chủ public
                </span>
              </div>
            </label>

            {form.show_on_home && (
              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
                <label className="text-[12px] font-semibold text-[#0b132b] shrink-0">
                  Thứ tự hiển thị Mục 01:
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.home_order}
                  onChange={(e) => onChange({ home_order: Number(e.target.value) || 0 })}
                  placeholder="0, 1, 2..."
                  className="w-24 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-2.5 py-1.5 text-[12px] font-mono font-bold focus:outline-none focus:border-[#0b132b]"
                />
              </div>
            )}
          </div>

          {/* Mục 02: Bảng thông số & Tài liệu */}
          <div className="bg-white border border-[#dce2ea] rounded-[6px] p-3.5 flex flex-col gap-3 shadow-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_in_quick_specs}
                onChange={(e) => onChange({ show_in_quick_specs: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-[#0b132b]"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#0b132b] flex items-center gap-1.5">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                    Mục 02
                  </span>
                  Bảng Thông Số & Tài Liệu Kỹ Thuật
                </span>
                <span className="text-[11px] text-[#64748b] mt-0.5">
                  Hiển thị dòng thông số kèm tài liệu PDF ở Mục 02 trang chủ
                </span>
              </div>
            </label>

            {form.show_in_quick_specs && (
              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
                <label className="text-[12px] font-semibold text-[#0b132b] shrink-0">
                  Thứ tự hiển thị Mục 02:
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quick_spec_order}
                  onChange={(e) => onChange({ quick_spec_order: Number(e.target.value) || 0 })}
                  placeholder="0, 1, 2..."
                  className="w-24 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-2.5 py-1.5 text-[12px] font-mono font-bold focus:outline-none focus:border-[#0b132b]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Cấu hình chi tiết cho Mục 02 (Khi được bật) */}
        {form.show_in_quick_specs && (
          <div className="bg-white border border-[#dce2ea] rounded-[6px] p-3.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">
                Tóm Tắt Kích Thước / Thông Số (Cột &quot;Kích Thước / Thông Số&quot; Mục 02)
              </label>
              <input
                type="text"
                value={form.spec_summary}
                onChange={(e) => onChange({ spec_summary: e.target.value })}
                placeholder="Vd: Hành trình 800x500x550 mm, 10.000 RPM BT40"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            {/* Tài liệu kỹ thuật / Datasheet PDF cho Mục 02 */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[#0b132b] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tài Liệu Kỹ Thuật / Spec Sheet (PDF) Mục 02:</span>
                </label>
                {form.datasheet_url && (
                  <a
                    href={form.datasheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Xem tệp hiện tại</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.datasheet_url}
                  onChange={(e) => onChange({ datasheet_url: e.target.value })}
                  placeholder="URL tệp PDF (vd: /assets/docs/ax-vmc850.pdf hoặc https://...)"
                  className="flex-1 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-[#0b132b]"
                />

                <label className="min-h-[38px] px-3 border border-[#dce2ea] bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#0b132b] rounded-[4px] text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  {isUploadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0b132b]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#0b132b]" />
                  )}
                  <span>{isUploadingPdf ? 'Đang tải...' : 'Tải PDF lên'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleUploadDatasheet}
                    disabled={isUploadingPdf}
                    className="hidden"
                  />
                </label>

                {form.datasheet_url && (
                  <button
                    type="button"
                    onClick={() => onChange({ datasheet_url: '' })}
                    title="Xóa tài liệu đính kèm"
                    className="w-[38px] h-[38px] border border-red-200 text-red-600 hover:bg-red-50 rounded-[4px] inline-flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tùy chọn lọc nổi bật toàn website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2.5 bg-white border border-[#dce2ea] rounded-[6px] p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => onChange({ is_featured: e.target.checked })}
            className="w-4 h-4 accent-[#0b132b]"
          />
          <Star className="w-4 h-4 text-[#f59e0b] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#0b132b]">Sản phẩm nổi bật</span>
            <span className="text-[11px] text-[#64748b]">Ưu tiên lọc nổi bật ở trang danh sách sản phẩm</span>
          </div>
        </label>
      </div>

      {/* Điểm mạnh & Quy cách đóng gói */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-[#dce2ea] rounded-[6px] p-3.5">
        <RepeatableStringList
          label="Ưu Điểm Nổi Bật Riêng (tùy chọn)"
          items={form.highlights}
          onChange={(highlights) => onChange({ highlights })}
          helperText="Để trống nếu dùng nội dung mặc định toàn website."
        />

        <RepeatableStringList
          label="Quy Cách Đóng Gói Riêng (tùy chọn)"
          items={form.packaging}
          onChange={(packaging) => onChange({ packaging })}
          helperText="Để trống nếu dùng nội dung mặc định toàn website."
        />
      </div>

      {/* SEO Section */}
      <SeoFieldsSection
        metaTitle={form.meta_title}
        metaDescription={form.meta_description}
        metaKeywords={form.meta_keywords}
        onChangeMetaTitle={(meta_title) => onChange({ meta_title })}
        onChangeMetaDescription={(meta_description) => onChange({ meta_description })}
        onChangeMetaKeywords={(meta_keywords) => onChange({ meta_keywords })}
        onAutoGenerate={handleAutoGenerateSeo}
        previewSlug={`/products/${form.sku ? form.sku.toLowerCase() : 'san-pham'}`}
        fallbackTitle={fallback.meta_title}
        fallbackDescription={fallback.meta_description}
      />
    </div>
  );
}
