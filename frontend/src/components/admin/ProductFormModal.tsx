'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ExternalLink, Loader2, Package, X } from 'lucide-react';
import { Category, Product, ProductPayload } from '@/lib/types';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';
import { ProductFormState, SpecRow } from './product-form/types';
import ProductBasicInfoSection from './product-form/ProductBasicInfoSection';
import ProductMediaSection from './product-form/ProductMediaSection';
import ProductSpecsSection from './product-form/ProductSpecsSection';
import ProductMarketingSection from './product-form/ProductMarketingSection';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: Category[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: ProductPayload) => Promise<void>;
}

function buildInitialState(editingProduct: Product | null, categories: Category[]): ProductFormState {
  if (!editingProduct) {
    return {
      category_id: categories[0]?.id || 1,
      sku: 'AX-NEW-' + Math.floor(100 + Math.random() * 900),
      name: '',
      brand: 'Axiom Tooling',
      stock_status: 'in_stock',
      price_display: 'Liên hệ báo giá',
      description: '',
      images: [SAMPLE_PRODUCT_IMAGES[0], SAMPLE_PRODUCT_IMAGES[1]],
      specRows: [
        { key: 'Kích thước / Dải đo', value: '' },
        { key: 'Độ chính xác / Dung sai', value: '' },
        { key: 'Vật liệu chế tạo', value: '' },
      ],
      spec_summary: '',
      certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng'],
      datasheet_url: '',
      is_featured: false,
      show_on_home: false,
      home_order: 0,
      show_in_quick_specs: false,
      quick_spec_order: 0,
      highlights: [],
      packaging: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      newImageUrl: '',
      customCertInput: '',
    };
  }

  const specEntries: SpecRow[] = editingProduct.specifications
    ? Object.entries(editingProduct.specifications).map(([key, value]) => ({ key, value }))
    : [{ key: 'Thông số kỹ thuật', value: '' }];

  const initialImages =
    Array.isArray(editingProduct.images) && editingProduct.images.length > 0
      ? [...editingProduct.images]
      : editingProduct.image_url
        ? [editingProduct.image_url]
        : [SAMPLE_PRODUCT_IMAGES[0]];

  const initialCerts =
    Array.isArray(editingProduct.certificates) && editingProduct.certificates.length > 0
      ? [...editingProduct.certificates]
      : editingProduct.has_cocq
        ? ['CO/CQ Gốc Nhà Máy']
        : [];

  return {
    category_id: editingProduct.category_id,
    sku: editingProduct.sku,
    name: editingProduct.name,
    brand: editingProduct.brand,
    stock_status: editingProduct.stock_status,
    price_display: editingProduct.price_display || 'Liên hệ báo giá',
    description: editingProduct.description || '',
    images: initialImages,
    specRows: specEntries,
    spec_summary: editingProduct.spec_summary || '',
    certificates: initialCerts,
    datasheet_url: editingProduct.datasheet_url || '',
    is_featured: Boolean(editingProduct.is_featured),
    show_on_home: Boolean(editingProduct.show_on_home),
    home_order: editingProduct.home_order ?? 0,
    show_in_quick_specs: Boolean(editingProduct.show_in_quick_specs),
    quick_spec_order: editingProduct.quick_spec_order ?? 0,
    highlights: Array.isArray(editingProduct.highlights) ? [...editingProduct.highlights] : [],
    packaging: Array.isArray(editingProduct.packaging) ? [...editingProduct.packaging] : [],
    meta_title: editingProduct.meta_title || '',
    meta_description: editingProduct.meta_description || '',
    meta_keywords: editingProduct.meta_keywords || '',
    newImageUrl: '',
    customCertInput: '',
  };
}

export default function ProductFormModal({
  isOpen,
  editingProduct,
  categories,
  saving,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormState>(() =>
    buildInitialState(editingProduct, categories)
  );

  useEffect(() => {
    if (!isOpen) return;
    setForm(buildInitialState(editingProduct, categories));
  }, [isOpen, editingProduct, categories]);

  if (!isOpen) return null;

  const updateForm = (patch: Partial<ProductFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const specsObject: Record<string, string> = {};
    form.specRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsObject[row.key.trim()] = row.value.trim();
      }
    });

    const cleanedHighlights = form.highlights.map((s) => s.trim()).filter(Boolean);
    const cleanedPackaging = form.packaging.map((s) => s.trim()).filter(Boolean);

    await onSave({
      category_id: Number(form.category_id),
      sku: form.sku.trim(),
      name: form.name.trim(),
      brand: form.brand.trim() || 'Axiom',
      stock_status: form.stock_status,
      price_display: form.price_display.trim() || 'Liên hệ báo giá',
      description: form.description.trim(),
      image_url: form.images[0] || SAMPLE_PRODUCT_IMAGES[0],
      images: form.images.length > 0 ? form.images : [SAMPLE_PRODUCT_IMAGES[0]],
      specifications: Object.keys(specsObject).length > 0 ? specsObject : undefined,
      spec_summary: form.spec_summary.trim() || null,
      has_cocq: form.certificates.length > 0,
      certificates: form.certificates,
      datasheet_url: form.datasheet_url.trim() || null,
      is_featured: form.is_featured,
      show_on_home: form.show_on_home,
      home_order: Number(form.home_order) || 0,
      show_in_quick_specs: form.show_in_quick_specs,
      quick_spec_order: Number(form.quick_spec_order) || 0,
      highlights: cleanedHighlights.length > 0 ? cleanedHighlights : null,
      packaging: cleanedPackaging.length > 0 ? cleanedPackaging : null,
      meta_title: form.meta_title.trim() || undefined,
      meta_description: form.meta_description.trim() || undefined,
      meta_keywords: form.meta_keywords.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
      <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[820px] p-4 sm:p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto overflow-x-hidden">
        <div className="flex items-start sm:items-center justify-between gap-3 border-b border-[#dce2ea] pb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[4px] bg-[#0b132b] text-white flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-[#0b132b] truncate">
                {editingProduct
                  ? `Chỉnh Sửa Sản Phẩm (${editingProduct.sku})`
                  : 'Thêm Sản Phẩm Mới'}
              </h2>
              <p className="text-[11px] text-[#475569] line-clamp-2 sm:line-clamp-none">
                Quản lý thông số kỹ thuật, hình ảnh, PDF spec sheet, chứng chỉ CO/CQ và hiển thị trang chủ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {editingProduct && (
              <a
                href={`/products/${editingProduct.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex text-[12px] bg-[#f8fafc] border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] px-3 py-1.5 rounded-[4px] font-medium items-center gap-1.5 transition-colors"
              >
                <span>Xem Trên Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng modal"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f8fafc] text-[#475569] transition-colors cursor-pointer"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <ProductBasicInfoSection form={form} categories={categories} onChange={updateForm} />
          <ProductMediaSection form={form} onChange={updateForm} />
          <ProductSpecsSection form={form} onChange={updateForm} />
          <ProductMarketingSection form={form} onChange={updateForm} />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#dce2ea]">
            {editingProduct ? (
              <a
                href={`/products/${editingProduct.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#0b132b] hover:text-[#d97706] font-semibold flex items-center justify-center sm:justify-start gap-1 py-1"
              >
                <span>Mở trang chi tiết sản phẩm ngoài web</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 sm:py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px] font-medium cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 sm:py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingProduct ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
