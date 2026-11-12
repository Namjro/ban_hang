'use client';

import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { ProductDetailSettings } from '@/lib/types';
import RepeatableStringList from '@/components/admin/shared/RepeatableStringList';

interface ProductDetailSettingsFormProps {
  initialData: ProductDetailSettings;
  saving: boolean;
  onSave: (data: ProductDetailSettings) => Promise<void>;
}

export default function ProductDetailSettingsForm({
  initialData,
  saving,
  onSave,
}: ProductDetailSettingsFormProps) {
  const [form, setForm] = useState<ProductDetailSettings>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      guarantees: form.guarantees.map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.map((s) => s.trim()).filter(Boolean),
      packaging: form.packaging.map((s) => s.trim()).filter(Boolean),
      default_certificates: form.default_certificates.map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Ghi Chú Chiết Khấu</label>
          <input
            type="text"
            value={form.discount_note}
            onChange={(e) => setForm({ ...form, discount_note: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Thông Tin VAT</label>
          <input
            type="text"
            value={form.vat_note}
            onChange={(e) => setForm({ ...form, vat_note: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Thông Tin Hóa Đơn</label>
          <input
            type="text"
            value={form.invoice_note}
            onChange={(e) => setForm({ ...form, invoice_note: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <RepeatableStringList
        label="3 Cam Kết Dưới Nút Báo Giá"
        items={form.guarantees}
        onChange={(guarantees) => setForm({ ...form, guarantees })}
        maxItems={6}
      />

      <RepeatableStringList
        label="Ưu Điểm Nổi Bật Mặc Định"
        items={form.highlights}
        onChange={(highlights) => setForm({ ...form, highlights })}
        helperText="Áp dụng khi sản phẩm không cấu hình ưu điểm riêng."
      />

      <RepeatableStringList
        label="Quy Cách Đóng Gói & Xuất Xưởng Mặc Định"
        items={form.packaging}
        onChange={(packaging) => setForm({ ...form, packaging })}
        helperText="Áp dụng khi sản phẩm không cấu hình quy cách đóng gói riêng."
      />

      <RepeatableStringList
        label="Chứng Chỉ Mặc Định (khi bật CO/CQ nhưng chưa chọn chứng chỉ riêng)"
        items={form.default_certificates}
        onChange={(default_certificates) => setForm({ ...form, default_certificates })}
      />

      <div className="flex justify-end pt-2 border-t border-[#dce2ea]">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-[#0b132b] font-semibold text-[13px] px-5 py-2.5 rounded-[4px] cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Đang lưu...' : 'Lưu Cấu Hình Chi Tiết SP'}</span>
        </button>
      </div>
    </form>
  );
}
