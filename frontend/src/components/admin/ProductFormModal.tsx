'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Package,
  ExternalLink,
  X,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Check,
  Trash2,
  Layers,
  Plus,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { Category, Product, ProductPayload, StockStatus } from '@/lib/types';
import { PRESET_CERTIFICATES, SAMPLE_PRODUCT_IMAGES } from '@/constants';
import { productService } from '@/services';

interface SpecRow {
  key: string;
  value: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: Category[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: ProductPayload) => Promise<void>;
}

export default function ProductFormModal({
  isOpen,
  editingProduct,
  categories,
  saving,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    category_id: 1,
    sku: '',
    name: '',
    brand: 'Axiom Tooling',
    stock_status: 'in_stock' as StockStatus,
    price_display: 'Liên hệ báo giá',
    description: '',
    images: [] as string[],
    specRows: [] as SpecRow[],
    certificates: [] as string[],
    newImageUrl: '',
    customCertInput: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      const specEntries: SpecRow[] = editingProduct.specifications
        ? Object.entries(editingProduct.specifications).map(([key, value]) => ({ key, value }))
        : [{ key: 'Thông số kỹ thuật', value: '' }];

      let initialImages: string[] = [];
      if (Array.isArray(editingProduct.images) && editingProduct.images.length > 0) {
        initialImages = [...editingProduct.images];
      } else if (editingProduct.image_url) {
        initialImages = [editingProduct.image_url];
      } else {
        initialImages = [SAMPLE_PRODUCT_IMAGES[0]];
      }

      let initialCerts: string[] = [];
      if (Array.isArray(editingProduct.certificates) && editingProduct.certificates.length > 0) {
        initialCerts = [...editingProduct.certificates];
      } else if (editingProduct.has_cocq) {
        initialCerts = ['CO/CQ Gốc Nhà Máy'];
      }

      setForm({
        category_id: editingProduct.category_id,
        sku: editingProduct.sku,
        name: editingProduct.name,
        brand: editingProduct.brand,
        stock_status: editingProduct.stock_status,
        price_display: editingProduct.price_display || 'Liên hệ báo giá',
        description: editingProduct.description || '',
        images: initialImages,
        specRows: specEntries,
        certificates: initialCerts,
        newImageUrl: '',
        customCertInput: '',
      });
    } else {
      setForm({
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
        certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng'],
        newImageUrl: '',
        customCertInput: '',
      });
    }
  }, [isOpen, editingProduct, categories]);

  if (!isOpen) return null;

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadMessage(`Đang tải lên ${fileArray.length} ảnh...`);

    try {
      const res = await productService.uploadImages(fileArray);
      if (res.success && Array.isArray(res.data)) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data],
        }));
        setUploadMessage(`Đã tải lên thành công ${res.data.length} ảnh từ máy tính!`);
        setTimeout(() => setUploadMessage(null), 3500);
      }
    } catch (err) {
      console.warn('Backend upload không phản hồi, nạp ảnh trực tiếp qua Data URL:', err);
      const readPromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64List = await Promise.all(readPromises);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64List],
      }));
      setUploadMessage(`Đã nạp thành công ${base64List.length} ảnh từ máy tính.`);
      setTimeout(() => setUploadMessage(null), 3500);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    if (!form.newImageUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: '',
    }));
  };

  const handleAddPresetImage = (url: string) => {
    if (form.images.includes(url)) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setForm((prev) => {
      const selected = prev.images[indexToPrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
  };

  const handleAddSpecRow = () => {
    setForm((prev) => ({
      ...prev,
      specRows: [...prev.specRows, { key: '', value: '' }],
    }));
  };

  const handleUpdateSpecRow = (index: number, field: 'key' | 'value', text: string) => {
    setForm((prev) => {
      const updated = [...prev.specRows];
      updated[index] = { ...updated[index], [field]: text };
      return { ...prev, specRows: updated };
    });
  };

  const handleRemoveSpecRow = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      specRows: prev.specRows.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleToggleCertificate = (certName: string) => {
    setForm((prev) => {
      const exists = prev.certificates.includes(certName);
      if (exists) {
        return { ...prev, certificates: prev.certificates.filter((c) => c !== certName) };
      } else {
        return { ...prev, certificates: [...prev.certificates, certName] };
      }
    });
  };

  const handleAddCustomCert = () => {
    if (!form.customCertInput.trim()) return;
    const cert = form.customCertInput.trim();
    if (!form.certificates.includes(cert)) {
      setForm((prev) => ({
        ...prev,
        certificates: [...prev.certificates, cert],
        customCertInput: '',
      }));
    }
  };

  const handleRemoveCertificate = (certToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c !== certToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sku || !form.name) {
      alert('Vui lòng nhập đầy đủ mã SKU và tên sản phẩm.');
      return;
    }

    const specsPayload: Record<string, string> = {};
    form.specRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsPayload[row.key.trim()] = row.value.trim();
      }
    });

    const primaryImage = form.images[0] || SAMPLE_PRODUCT_IMAGES[0];

    await onSave({
      category_id: form.category_id,
      sku: form.sku,
      name: form.name,
      brand: form.brand,
      stock_status: form.stock_status,
      price_display: form.price_display,
      description: form.description,
      image_url: primaryImage,
      images: form.images.length > 0 ? form.images : [primaryImage],
      specifications: specsPayload,
      has_cocq: form.certificates.length > 0,
      certificates: form.certificates,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
      <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[760px] p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#0b132b] text-white flex items-center justify-center">
              <Package className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0b132b]">
                {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới (SKU)'}
              </h3>
              <p className="text-[12px] text-[#475569]">
                Cập nhật ảnh thư viện, thông số kỹ thuật đa chiều và chứng nhận chất lượng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingProduct && (
              <a
                href={`/products/${editingProduct.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#0b132b] hover:text-[#d97706] font-semibold flex items-center gap-1 bg-[#f8fafc] border border-[#dce2ea] px-2.5 py-1.5 rounded-[4px] transition-colors"
                title="Mở xem trang chi tiết ở tab mới"
              >
                <span>Xem trang web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] hover:bg-[#f8fafc] text-[#475569] transition-colors cursor-pointer"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">Mã SKU *</label>
              <input
                type="text"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="AX-..."
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono uppercase focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">Nhóm Danh Mục *</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">
              Tên Thiết Bị / Dụng Cụ *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Trung Tâm Gia Công Đứng CNC VMC-850"
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">Thương Hiệu</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Mitutoyo, Axiom, SKF..."
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">Tình Trạng Kho</label>
              <select
                value={form.stock_status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock_status: e.target.value as StockStatus,
                  })
                }
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none"
              >
                <option value="in_stock">Hàng có sẵn</option>
                <option value="low_stock">Sắp hết hàng</option>
                <option value="pre_order">Đặt hàng theo lịch</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0b132b]">Hiển Thị Giá</label>
              <input
                type="text"
                value={form.price_display}
                onChange={(e) => setForm({ ...form, price_display: e.target.value })}
                placeholder="Liên hệ báo giá"
                className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none"
              />
            </div>
          </div>

          {/* 1. Multiple Images Management with Drag & Drop Upload */}
          <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                <ImageIcon className="w-4 h-4 text-[#f59e0b]" />
                <span>Bộ Sưu Tập Ảnh Sản Phẩm ({form.images.length} ảnh)</span>
              </div>
              <span className="text-[11px] text-[#475569]">
                Ảnh đầu tiên sẽ là ảnh bìa đại diện
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDropFiles}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[6px] p-5 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#f59e0b] bg-[#fef3c7]/50 scale-[1.01]'
                  : 'border-[#cbd5e1] bg-white hover:border-[#0b132b] hover:bg-[#f8fafc]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleUploadFiles(e.target.files);
                  }
                }}
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                className="hidden"
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
                  <span className="text-[13px] font-semibold text-[#0b132b]">
                    {uploadMessage || 'Đang tải ảnh lên...'}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b] shadow-2xs">
                    <UploadCloud className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-[#0b132b]">
                      Kéo & thả ảnh từ máy tính vào đây, hoặc{' '}
                      <span className="text-[#d97706] underline">bấm để chọn file</span>
                    </span>
                    <span className="text-[11px] text-[#475569]">
                      Hỗ trợ chọn nhiều ảnh cùng lúc: PNG, JPG, JPEG, WEBP (Tối đa 10MB/ảnh)
                    </span>
                  </div>
                </>
              )}
            </div>

            {uploadMessage && !isUploading && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] px-3 py-2 rounded-[4px] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            {form.images.length === 0 ? (
              <div className="p-4 text-center text-[#94a3b8] text-[12px] bg-white border border-[#dce2ea] rounded-[4px]">
                Chưa có ảnh nào. Kéo thả ảnh từ máy tính hoặc dán link URL bên dưới.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {form.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white border border-[#dce2ea] rounded-[4px] p-2 flex flex-col items-center gap-1.5 group hover:border-[#0b132b] transition-colors"
                  >
                    <div className="relative w-full h-[85px] bg-[#f8fafc] rounded-[2px] overflow-hidden flex items-center justify-center">
                      <Image
                        src={imgUrl}
                        alt={`Product preview ${idx}`}
                        fill
                        unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('http')}
                        className="object-contain p-1"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-[#0b132b] text-[#f59e0b] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] shadow-xs">
                          Ảnh Bìa
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full pt-1 text-[11px]">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="text-[#0b132b] hover:text-[#d97706] text-[10px] font-medium cursor-pointer"
                        >
                          Đặt làm bìa
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[10px]">Chính</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-red-500 hover:text-red-700 p-0.5 rounded cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-center pt-1">
              <input
                type="text"
                value={form.newImageUrl}
                onChange={(e) => setForm({ ...form, newImageUrl: e.target.value })}
                placeholder="Hoặc dán URL ảnh trực tiếp (vd: https://... hoặc /assets/...)"
                className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0b132b]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-[#0b132b] text-white text-[12px] px-3 py-1.5 rounded-[4px] font-medium hover:bg-[#152039] shrink-0 cursor-pointer"
              >
                + Thêm Link
              </button>
            </div>

            <div className="pt-2 border-t border-[#dce2ea]/70 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#475569]">
                Chọn nhanh từ thư viện ảnh cơ khí chuẩn AXIOM:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_PRODUCT_IMAGES.map((sampleUrl, sIdx) => {
                  const isAdded = form.images.includes(sampleUrl);
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAddPresetImage(sampleUrl)}
                      className={`relative w-12 h-12 bg-white border rounded-[4px] shrink-0 overflow-hidden p-1 transition-all cursor-pointer ${
                        isAdded
                          ? 'border-[#10b981] ring-1 ring-[#10b981] opacity-60'
                          : 'border-[#dce2ea] hover:border-[#0b132b]'
                      }`}
                      title={isAdded ? 'Đã thêm' : 'Bấm để thêm ảnh này'}
                    >
                      <Image
                        src={sampleUrl}
                        alt={`Sample ${sIdx + 1}`}
                        fill
                        className="object-contain p-0.5"
                      />
                      {isAdded && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-800 font-bold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Dynamic Technical Specifications */}
          <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                <Layers className="w-4 h-4 text-[#f59e0b]" />
                <span>Thông Số Kỹ Thuật Chi Tiết ({form.specRows.length} thông số)</span>
              </div>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="text-[12px] bg-white border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] px-2.5 py-1 rounded-[4px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Thêm Dòng Thông Số</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {form.specRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                    placeholder="Tên thông số (vd: Hành trình X/Y/Z)"
                    className="w-1/2 bg-white border border-[#dce2ea] rounded-[4px] p-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                    placeholder="Giá trị (vd: 800 x 500 x 550 mm)"
                    className="w-1/2 bg-white border border-[#dce2ea] rounded-[4px] p-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecRow(idx)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[4px] shrink-0 cursor-pointer"
                    title="Xóa thông số này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Certificates & Compliance Manager */}
          <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                <Award className="w-4 h-4 text-[#f59e0b]" />
                <span>Chứng Chỉ & Tiêu Chuẩn Xuất Xưởng ({form.certificates.length})</span>
              </div>
              <span className="text-[11px] text-[#475569]">
                Kích hoạt hiển thị nhãn chứng nhận trên web
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_CERTIFICATES.map((cert) => {
                const isSelected = form.certificates.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleToggleCertificate(cert)}
                    className={`text-[11px] px-2.5 py-1 rounded-[4px] font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0b132b] text-white border-[#0b132b]'
                        : 'bg-white text-[#475569] border-[#dce2ea] hover:border-[#0b132b]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#f59e0b]" />}
                    <span>{cert}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 items-center pt-1">
              <input
                type="text"
                value={form.customCertInput}
                onChange={(e) => setForm({ ...form, customCertInput: e.target.value })}
                placeholder="Nhập tên chứng chỉ tiêu chuẩn khác..."
                className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0b132b]"
              />
              <button
                type="button"
                onClick={handleAddCustomCert}
                className="bg-[#f8fafc] border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] text-[12px] px-3 py-1.5 rounded-[4px] font-medium shrink-0 cursor-pointer"
              >
                + Thêm Chứng Chỉ
              </button>
            </div>

            {form.certificates.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.certificates.map((c) => (
                  <span
                    key={c}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded-[3px] flex items-center gap-1"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertificate(c)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4. Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">
              Mô Tả Kỹ Thuật & Ứng Dụng
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả tiêu chuẩn CO/CQ, ứng dụng trong phân xưởng gia công, bảo hành..."
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b] resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#dce2ea]">
            {editingProduct ? (
              <a
                href={`/products/${editingProduct.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#0b132b] hover:text-[#d97706] font-semibold flex items-center gap-1"
              >
                <span>Mở trang chi tiết sản phẩm ngoài web</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
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
                <span>{editingProduct ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
