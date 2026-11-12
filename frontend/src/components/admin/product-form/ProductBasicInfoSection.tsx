'use client';

import React from 'react';
import { Category, StockStatus } from '@/lib/types';
import { ProductFormState } from './types';
import SelectField from '@/components/ui/SelectField';

interface ProductBasicInfoSectionProps {
  form: ProductFormState;
  categories: Category[];
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductBasicInfoSection({
  form,
  categories,
  onChange,
}: ProductBasicInfoSectionProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[12px] font-semibold text-[#0b132b]">Mã SKU *</label>
          <input
            type="text"
            required
            value={form.sku}
            onChange={(e) => onChange({ sku: e.target.value })}
            placeholder="AX-..."
            className="w-full min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] font-mono uppercase focus:outline-none focus:border-[#0b132b]"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[12px] font-semibold text-[#0b132b]">Nhóm Danh Mục *</label>
          <SelectField
            value={form.category_id}
            onChange={(e) => onChange({ category_id: Number(e.target.value) })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <label className="text-[12px] font-semibold text-[#0b132b]">
          Tên Thiết Bị / Dụng Cụ *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Ví dụ: Trung Tâm Gia Công Đứng CNC VMC-850"
          className="w-full min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] focus:outline-none focus:border-[#0b132b]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[12px] font-semibold text-[#0b132b]">Thương Hiệu</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
            placeholder="Mitutoyo, Axiom, SKF..."
            className="w-full min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] focus:outline-none focus:border-[#0b132b]"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[12px] font-semibold text-[#0b132b]">Tình Trạng Kho</label>
          <SelectField
            value={form.stock_status}
            onChange={(e) => onChange({ stock_status: e.target.value as StockStatus })}
          >
            <option value="in_stock">Hàng có sẵn</option>
            <option value="low_stock">Sắp hết hàng</option>
            <option value="pre_order">Đặt hàng theo lịch</option>
          </SelectField>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[12px] font-semibold text-[#0b132b]">Hiển Thị Giá</label>
          <input
            type="text"
            value={form.price_display}
            onChange={(e) => onChange({ price_display: e.target.value })}
            placeholder="Liên hệ báo giá"
            className="w-full min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <label className="text-[12px] font-semibold text-[#0b132b]">
          Mô Tả Kỹ Thuật &amp; Ứng Dụng
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Mô tả tiêu chuẩn CO/CQ, ứng dụng trong phân xưởng gia công, bảo hành..."
          className="w-full min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2.5 text-[16px] sm:text-[13px] focus:outline-none focus:border-[#0b132b] resize-none"
        />
      </div>
    </div>
  );
}
