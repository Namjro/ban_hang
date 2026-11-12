'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { uploadService } from '@/services';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useToast } from '@/components/ui/Toast';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories' | 'site';
  placeholder?: string;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'site',
  placeholder = '/assets/images/...',
  helperText,
}: ImageUploadFieldProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImages([files[0]], folder);
      if (res.success && res.data.length > 0) {
        onChange(res.data[0]);
        toast.success('Đã tải ảnh lên thành công.');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Không thể tải ảnh lên.'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#0b132b]">{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-20 h-16 rounded-[6px] border border-[#dce2ea] bg-[#f8fafc] overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-[#94a3b8]" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b] focus:outline-none focus:border-[#0b132b]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                title="Xóa ảnh"
                className="px-2.5 border border-[#dce2ea] rounded-[4px] text-[#475569] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 bg-[#0b132b] hover:bg-[#152039] disabled:opacity-50 text-white text-[12px] font-semibold px-3.5 py-2 rounded-[4px] shrink-0 transition-colors cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-[#f59e0b]" />
              )}
              <span>{uploading ? 'Đang tải...' : 'Tải ảnh'}</span>
            </button>
          </div>
          {helperText && <span className="text-[11px] text-[#64748b]">{helperText}</span>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
