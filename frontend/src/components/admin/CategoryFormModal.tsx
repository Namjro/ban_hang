'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Loader2,
  X,
  AlertCircle,
  Factory,
  Crosshair,
  Gauge,
  Settings,
  ShieldCheck,
  Zap,
  Box,
  Wrench,
  Cpu,
  Layers,
} from 'lucide-react';
import { Category, CategoryHighlight, CategoryPayload } from '@/lib/types';
import ImageUploadField from '@/components/admin/shared/ImageUploadField';
import SeoFieldsSection from '@/components/admin/shared/SeoFieldsSection';
import { generateCategorySeoFallback } from '@/lib/seo';

export const CATEGORY_ICON_OPTIONS = [
  { id: 'factory', label: 'Nhà máy / CNC', icon: Factory },
  { id: 'crosshair', label: 'Cắt gọt / Dao phay', icon: Crosshair },
  { id: 'gauge', label: 'Đo lường / Thước', icon: Gauge },
  { id: 'settings', label: 'Cơ khí / Gá kẹp', icon: Settings },
  { id: 'shield', label: 'Bảo hộ / Tiêu chuẩn', icon: ShieldCheck },
  { id: 'zap', label: 'Điện / Tự động hóa', icon: Zap },
  { id: 'box', label: 'Vật tư / Phụ tùng', icon: Box },
  { id: 'wrench', label: 'Bảo trì / Dụng cụ', icon: Wrench },
  { id: 'cpu', label: 'Điều khiển / PLC', icon: Cpu },
  { id: 'layers', label: 'Phôi / Vật liệu', icon: Layers },
] as const;

export function getCategoryIcon(iconId?: string | null) {
  const match = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === iconId);
  return match ? match.icon : FolderTree;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  defaultOrder: number;
  saving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (payload: CategoryPayload) => Promise<void>;
}

export default function CategoryFormModal({
  isOpen,
  editingCategory,
  defaultOrder,
  saving,
  errorMessage,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    slug: '',
    description: '',
    icon: 'factory',
    image_url: '',
    highlights: [] as CategoryHighlight[],
    show_on_home: true,
    order: defaultOrder,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        subtitle: editingCategory.subtitle || '',
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        icon: editingCategory.icon || 'factory',
        image_url: editingCategory.image_url || '',
        highlights: Array.isArray(editingCategory.highlights) ? editingCategory.highlights : [],
        show_on_home: editingCategory.show_on_home ?? true,
        order: editingCategory.order || 0,
        meta_title: editingCategory.meta_title || '',
        meta_description: editingCategory.meta_description || '',
        meta_keywords: editingCategory.meta_keywords || '',
      });
    } else {
      setForm({
        name: '',
        subtitle: '',
        slug: '',
        description: '',
        icon: 'factory',
        image_url: '',
        highlights: [
          { label: 'Thiết Bị', value: '' },
          { label: 'Lựa Chọn Theo', value: '' },
        ],
        show_on_home: true,
        order: defaultOrder,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
      });
    }
  }, [isOpen, editingCategory, defaultOrder]);

  if (!isOpen) return null;

  const handleNameChange = (newName: string) => {
    setForm((prev) => {
      const shouldUpdateSlug = !editingCategory || prev.slug === '';
      const autoSlug = newName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        ...prev,
        name: newName,
        slug: shouldUpdateSlug ? autoSlug : prev.slug,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedHighlights = form.highlights
      .map((h) => ({ label: h.label.trim(), value: h.value.trim() }))
      .filter((h) => h.label && h.value)
      .slice(0, 2);

    await onSave({
      name: form.name.trim(),
      subtitle: form.subtitle.trim() || null,
      slug: form.slug.trim(),
      description: form.description.trim(),
      icon: form.icon,
      image_url: form.image_url.trim() || null,
      highlights: cleanedHighlights,
      show_on_home: form.show_on_home,
      order: Number(form.order) || 0,
      meta_title: form.meta_title.trim() || undefined,
      meta_description: form.meta_description.trim() || undefined,
      meta_keywords: form.meta_keywords.trim() || undefined,
    });
  };

  const seoFallback = generateCategorySeoFallback({
    name: form.name,
    subtitle: form.subtitle,
    description: form.description,
  });

  const PreviewIcon = getCategoryIcon(form.icon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
      <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[580px] p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#0b132b] text-white flex items-center justify-center">
              <FolderTree className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0b132b]">
                {editingCategory ? 'Chỉnh Sửa Nhóm Danh Mục' : 'Thêm Danh Mục Thiết Bị Mới'}
              </h3>
              <p className="text-[12px] text-[#475569]">
                Định hình cấu trúc nhóm vật tư, icon đại diện và đường dẫn SEO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] hover:bg-[#f8fafc] text-[#475569] transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] flex items-center gap-2 text-red-700 text-[12px]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">Tên Danh Mục *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ví dụ: Thiết Bị Thủy Lực & Khí Nén"
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-semibold focus:outline-none focus:border-[#0b132b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">
                Đường Dẫn Slug (SEO / URL) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="thiet-bi-thuy-luc"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">
                Thứ Tự Hiển Thị (Order)
              </label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                placeholder="1, 2, 3..."
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono focus:outline-none focus:border-[#0b132b]"
              />
            </div>
          </div>

          {/* Icon selector */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">
              Biểu Tượng Nhận Diện (Icon)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORY_ICON_OPTIONS.map((opt) => {
                const OptIcon = opt.icon;
                const isSelected = form.icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setForm({ ...form, icon: opt.id })}
                    className={`flex flex-col items-center justify-center p-2 rounded-[4px] border transition-all text-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0b132b] text-[#f59e0b] border-[#0b132b] ring-1 ring-[#0b132b]'
                        : 'bg-[#f8fafc] text-[#475569] border-[#dce2ea] hover:border-[#0b132b]'
                    }`}
                  >
                    <OptIcon className="w-4 h-4" />
                    <span className="text-[10px] font-medium truncate w-full">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">Mô Tả Danh Mục</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả phạm vi ứng dụng, nhóm thiết bị trực thuộc..."
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b] resize-none"
            />
          </div>

          {/* Homepage Display Settings */}
          <div className="border-t border-[#dce2ea] pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
                Hiển Thị Trang Chủ
              </span>
              <label className="inline-flex items-center gap-2 text-[12px] font-medium text-[#0b132b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_on_home}
                  onChange={(e) => setForm({ ...form, show_on_home: e.target.checked })}
                  className="w-4 h-4 accent-[#0b132b]"
                />
                <span>Hiện trên trang chủ</span>
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">
                Nhãn Phụ (Subtitle trên thẻ danh mục)
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Vd: GIA CÔNG CƠ KHÍ"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            <ImageUploadField
              label="Ảnh Đại Diện Danh Mục"
              value={form.image_url}
              onChange={(image_url) => setForm({ ...form, image_url })}
              folder="categories"
              placeholder="/assets/images/cat-cnc.png"
            />

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-[#0b132b]">
                2 Dòng Thông Tin Nổi Bật (tối đa 2)
              </label>
              {[0, 1].map((idx) => {
                const current = form.highlights[idx] || { label: '', value: '' };
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={current.label}
                      onChange={(e) => {
                        const next = [...form.highlights];
                        next[idx] = { ...current, label: e.target.value };
                        setForm({ ...form, highlights: next });
                      }}
                      placeholder={idx === 0 ? 'Nhãn (vd: Thiết Bị)' : 'Nhãn (vd: Lựa Chọn Theo)'}
                      className="sm:col-span-4 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-2.5 py-1.5 text-[12px]"
                    />
                    <input
                      type="text"
                      value={current.value}
                      onChange={(e) => {
                        const next = [...form.highlights];
                        next[idx] = { ...current, value: e.target.value };
                        setForm({ ...form, highlights: next });
                      }}
                      placeholder={
                        idx === 0 ? 'Tiện, Phay, Cưa vòng...' : 'Tải trọng • Trục • Công suất'
                      }
                      className="sm:col-span-8 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-2.5 py-1.5 text-[12px]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="border border-[#dce2ea] rounded-[6px] p-3 bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center">
                <PreviewIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#0b132b]">
                  {form.name || 'Tên danh mục xem trước'}
                </span>
                <span className="text-[11px] text-[#475569] font-mono">
                  /products?category={form.slug || 'slug'}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-white border border-[#dce2ea] px-2 py-0.5 rounded font-mono text-[#475569]">
              Preview
            </span>
          </div>

          {/* SEO Fields */}
          <SeoFieldsSection
            metaTitle={form.meta_title}
            metaDescription={form.meta_description}
            metaKeywords={form.meta_keywords}
            onChangeMetaTitle={(meta_title) => setForm((prev) => ({ ...prev, meta_title }))}
            onChangeMetaDescription={(meta_description) =>
              setForm((prev) => ({ ...prev, meta_description }))
            }
            onChangeMetaKeywords={(meta_keywords) =>
              setForm((prev) => ({ ...prev, meta_keywords }))
            }
            onAutoGenerate={() =>
              setForm((prev) => ({
                ...prev,
                meta_title: seoFallback.meta_title,
                meta_description: seoFallback.meta_description,
                meta_keywords: seoFallback.meta_keywords,
              }))
            }
            previewSlug={`/products?category=${form.slug || 'slug'}`}
            fallbackTitle={seoFallback.meta_title}
            fallbackDescription={seoFallback.meta_description}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dce2ea]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px] font-medium cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingCategory ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
