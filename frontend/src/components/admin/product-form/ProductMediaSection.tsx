'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from 'lucide-react';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';
import { productService, uploadService } from '@/services';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useToast } from '@/components/ui/Toast';
import { ProductFormState } from './types';

interface ProductMediaSectionProps {
  form: ProductFormState;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductMediaSection({ form, onChange }: ProductMediaSectionProps) {
  const toast = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.warning('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadMessage(`Đang tải lên ${fileArray.length} ảnh...`);

    try {
      const res = await productService.uploadImages(fileArray);
      if (res.success && res.data.length > 0) {
        onChange({ images: [...form.images, ...res.data] });
        setUploadMessage(`Đã tải lên thành công ${res.data.length} ảnh.`);
        toast.success(`Đã tải lên thành công ${res.data.length} ảnh.`);
      }
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Không thể tải ảnh lên.');
      setUploadMessage(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
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

  const handleAddImageUrl = () => {
    const trimmed = form.newImageUrl.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) {
      toast.warning('URL ảnh này đã có trong danh sách.');
      return;
    }
    onChange({ images: [...form.images, trimmed], newImageUrl: '' });
  };

  const handleAddPresetImage = (url: string) => {
    if (form.images.includes(url)) return;
    onChange({ images: [...form.images, url] });
  };

  const handleSetPrimaryImage = (idx: number) => {
    const updated = [...form.images];
    const [selected] = updated.splice(idx, 1);
    updated.unshift(selected);
    onChange({ images: updated });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Images Gallery */}
      <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
            <ImageIcon className="w-4 h-4 text-[#f59e0b]" />
            <span>Bộ Sưu Tập Ảnh Sản Phẩm ({form.images.length} ảnh)</span>
          </div>
          <span className="text-[11px] text-[#475569]">Ảnh đầu tiên sẽ là ảnh bìa đại diện</span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.length > 0) handleUploadFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[6px] p-4 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
            isDragging
              ? 'border-[#f59e0b] bg-[#fef3c7]/50'
              : 'border-[#cbd5e1] bg-white hover:border-[#0b132b]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) handleUploadFiles(e.target.files);
            }}
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex items-center gap-2 py-2 text-[13px] font-semibold text-[#0b132b]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{uploadMessage || 'Đang tải ảnh lên...'}</span>
            </div>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[12px] font-bold text-[#0b132b]">
                Kéo &amp; thả ảnh vào đây, hoặc <span className="text-[#d97706] underline">chọn file</span>
              </span>
              <span className="text-[11px] text-[#475569]">PNG, JPG, WEBP (Tối đa 10MB/ảnh)</span>
            </>
          )}
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative bg-white border border-[#dce2ea] rounded-[4px] p-2 flex flex-col items-center gap-1.5"
              >
                <div className="relative w-full h-[80px] bg-[#f8fafc] rounded-[2px] overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={`Product preview ${idx}`}
                    fill
                    unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('http')}
                    className="object-contain p-1"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#0b132b] text-[#f59e0b] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
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
                    onClick={() => onChange({ images: form.images.filter((_, i) => i !== idx) })}
                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={form.newImageUrl}
            onChange={(e) => onChange({ newImageUrl: e.target.value })}
            placeholder="Hoặc dán URL ảnh trực tiếp (https://... hoặc /assets/...)"
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
            Chọn nhanh từ thư viện ảnh mẫu AXIOM:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SAMPLE_PRODUCT_IMAGES.map((sampleUrl, sIdx) => {
              const isAdded = form.images.includes(sampleUrl);
              return (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleAddPresetImage(sampleUrl)}
                  className={`relative w-11 h-11 bg-white border rounded-[4px] shrink-0 overflow-hidden p-1 cursor-pointer ${
                    isAdded
                      ? 'border-[#10b981] ring-1 ring-[#10b981] opacity-60'
                      : 'border-[#dce2ea] hover:border-[#0b132b]'
                  }`}
                >
                  <Image src={sampleUrl} alt={`Sample ${sIdx + 1}`} fill className="object-contain p-0.5" />
                  {isAdded && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-800" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spec Sheet PDF */}
      <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
            <FileText className="w-4 h-4 text-[#f59e0b]" />
            <span>Tài Liệu Kỹ Thuật (Spec Sheet PDF)</span>
          </div>
          {form.datasheet_url && (
            <a
              href={form.datasheet_url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-semibold text-[#0b132b] hover:text-[#d97706] inline-flex items-center gap-1"
            >
              <span>Xem PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={form.datasheet_url}
            onChange={(e) => onChange({ datasheet_url: e.target.value })}
            placeholder="URL file PDF hoặc bấm Tải PDF..."
            className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
          />
          {form.datasheet_url && (
            <button
              type="button"
              onClick={() => onChange({ datasheet_url: '' })}
              className="p-2 border border-[#dce2ea] bg-white rounded-[4px] text-[#475569] hover:text-red-600 cursor-pointer"
              title="Xóa tài liệu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            disabled={isUploadingPdf}
            onClick={() => pdfInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 bg-[#0b132b] hover:bg-[#152039] disabled:opacity-50 text-white text-[12px] font-semibold px-3.5 py-2 rounded-[4px] shrink-0 cursor-pointer"
          >
            {isUploadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-[#f59e0b]" />
            )}
            <span>{isUploadingPdf ? 'Đang tải...' : 'Tải PDF'}</span>
          </button>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleUploadDatasheet}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
