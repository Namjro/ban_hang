'use client';

import React from 'react';
import { Star, Table2 } from 'lucide-react';
import RepeatableStringList from '@/components/admin/shared/RepeatableStringList';
import { ProductFormState } from './types';

interface ProductMarketingSectionProps {
  form: ProductFormState;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductMarketingSection({
  form,
  onChange,
}: ProductMarketingSectionProps) {
  return (
    <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-4">
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
            <span className="text-[11px] text-[#64748b]">Ưu tiên lọc nổi bật ở danh mục</span>
          </div>
        </label>

        <label className="flex items-center gap-2.5 bg-white border border-[#dce2ea] rounded-[6px] p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.show_in_quick_specs}
            onChange={(e) => onChange({ show_in_quick_specs: e.target.checked })}
            className="w-4 h-4 accent-[#0b132b]"
          />
          <Table2 className="w-4 h-4 text-[#0b132b] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#0b132b]">Hiện ở Bảng Thông Số Nhanh</span>
            <span className="text-[11px] text-[#64748b]">Hiển thị trên trang chủ</span>
          </div>
        </label>
      </div>

      {form.show_in_quick_specs && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white border border-[#dce2ea] rounded-[6px] p-3">
          <div className="sm:col-span-3 flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">
              Tóm Tắt Kích Thước / Thông Số (cột Bảng Thông Số Nhanh)
            </label>
            <input
              type="text"
              value={form.spec_summary}
              onChange={(e) => onChange({ spec_summary: e.target.value })}
              placeholder="Vd: Phạm vi đo 0–150 mm, IP67 kháng nước"
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#0b132b]">Thứ Tự</label>
            <input
              type="number"
              min={0}
              value={form.quick_spec_order}
              onChange={(e) => onChange({ quick_spec_order: Number(e.target.value) || 0 })}
              className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
            />
          </div>
        </div>
      )}

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
    </div>
  );
}
