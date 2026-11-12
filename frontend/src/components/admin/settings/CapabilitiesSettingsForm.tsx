'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { CapabilitiesSettings } from '@/lib/types';
import ImageUploadField from '@/components/admin/shared/ImageUploadField';
import IconPicker from '@/components/admin/shared/IconPicker';

interface CapabilitiesSettingsFormProps {
  initialData: CapabilitiesSettings;
  saving: boolean;
  onSave: (data: CapabilitiesSettings) => Promise<void>;
}

export default function CapabilitiesSettingsForm({
  initialData,
  saving,
  onSave,
}: CapabilitiesSettingsFormProps) {
  const [form, setForm] = useState<CapabilitiesSettings>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Nhãn Mục (Eyebrow)</label>
          <input
            type="text"
            value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Tiêu Đề *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Mô Tả Ngắn</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <ImageUploadField
        label="Ảnh Kho Hàng"
        value={form.image_url}
        onChange={(image_url) => setForm({ ...form, image_url })}
        folder="site"
      />

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Chú Thích Trên Ảnh Kho</label>
        <input
          type="text"
          value={form.image_caption}
          onChange={(e) => setForm({ ...form, image_caption: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#0b132b]">
            Các Điểm Năng Lực (tối đa 6)
          </label>
          <button
            type="button"
            disabled={form.items.length >= 6}
            onClick={() =>
              setForm({
                ...form,
                items: [...form.items, { icon: 'shield-check', title: '', desc: '' }],
              })
            }
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0b132b] hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm năng lực</span>
          </button>
        </div>

        {form.items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <IconPicker
                value={item.icon}
                onChange={(icon) => {
                  const next = [...form.items];
                  next[idx] = { ...next[idx], icon };
                  setForm({ ...form, items: next });
                }}
                className="w-60 shrink-0"
              />
              <input
                type="text"
                required
                value={item.title}
                onChange={(e) => {
                  const next = [...form.items];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setForm({ ...form, items: next });
                }}
                placeholder="Tiêu đề năng lực"
                className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] font-semibold text-[#0b132b]"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })
                }
                className="p-2 text-[#475569] hover:text-red-600 rounded-[4px] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={item.desc}
              onChange={(e) => {
                const next = [...form.items];
                next[idx] = { ...next[idx], desc: e.target.value };
                setForm({ ...form, items: next });
              }}
              placeholder="Mô tả chi tiết..."
              className="bg-white border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
            />
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
          <span>{saving ? 'Đang lưu...' : 'Lưu Năng Lực Kho'}</span>
        </button>
      </div>
    </form>
  );
}
