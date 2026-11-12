'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { TrustStatsSettings } from '@/lib/types';
import IconPicker from '@/components/admin/shared/IconPicker';

interface TrustStatsFormProps {
  initialData: TrustStatsSettings;
  saving: boolean;
  onSave: (data: TrustStatsSettings) => Promise<void>;
}

export default function TrustStatsForm({
  initialData,
  saving,
  onSave,
}: TrustStatsFormProps) {
  const [items, setItems] = useState(initialData.items);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ items });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-[#0b132b]">Chỉ Số Tin Cậy (1–4 mục)</h3>
          <p className="text-[12px] text-[#64748b]">
            Hiển thị ngay dưới Hero trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          disabled={items.length >= 4}
          onClick={() => setItems([...items, { icon: 'factory', value: '', label: '' }])}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0b132b] hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm chỉ số</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 bg-[#f8fafc] border border-[#dce2ea] rounded-[6px]"
          >
            <div className="md:col-span-4">
              <IconPicker
                value={item.icon}
                onChange={(icon) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], icon };
                  setItems(next);
                }}
              />
            </div>
            <input
              type="text"
              required
              value={item.value}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], value: e.target.value };
                setItems(next);
              }}
              placeholder="Vd: 10+"
              className="md:col-span-3 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] font-bold text-[#0b132b]"
            />
            <input
              type="text"
              required
              value={item.label}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], label: e.target.value };
                setItems(next);
              }}
              placeholder="Vd: Năm Kinh Nghiệm"
              className="md:col-span-4 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
            />
            <button
              type="button"
              disabled={items.length <= 1}
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
              className="md:col-span-1 p-2 text-[#475569] hover:text-red-600 disabled:opacity-30 rounded-[4px] cursor-pointer justify-self-end"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2 border-t border-[#dce2ea]">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-[#0b132b] font-semibold text-[13px] px-5 py-2.5 rounded-[4px] cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Đang lưu...' : 'Lưu Chỉ Số Tin Cậy'}</span>
        </button>
      </div>
    </form>
  );
}
