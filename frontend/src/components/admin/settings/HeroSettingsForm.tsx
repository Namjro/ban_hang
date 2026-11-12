'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { HeroSettings } from '@/lib/types';
import ImageUploadField from '@/components/admin/shared/ImageUploadField';
import IconPicker from '@/components/admin/shared/IconPicker';

interface HeroSettingsFormProps {
  initialData: HeroSettings;
  saving: boolean;
  onSave: (data: HeroSettings) => Promise<void>;
}

export default function HeroSettingsForm({
  initialData,
  saving,
  onSave,
}: HeroSettingsFormProps) {
  const [form, setForm] = useState<HeroSettings>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Nhãn Trên Tiêu Đề (Eyebrow)</label>
        <input
          type="text"
          value={form.eyebrow}
          onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Tiêu Đề Chính (H1) *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Mô Tả Ngắn</label>
        <textarea
          rows={3}
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-[#0b132b]">
            Nhãn Bảo Chứng (Badges - tối đa 4)
          </label>
          <button
            type="button"
            disabled={form.badges.length >= 4}
            onClick={() =>
              setForm({
                ...form,
                badges: [...form.badges, { icon: 'shield-check', text: '' }],
              })
            }
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0b132b] hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm badge</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {form.badges.map((badge, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-5">
                <IconPicker
                  value={badge.icon}
                  onChange={(icon) => {
                    const next = [...form.badges];
                    next[idx] = { ...next[idx], icon };
                    setForm({ ...form, badges: next });
                  }}
                />
              </div>
              <input
                type="text"
                required
                value={badge.text}
                onChange={(e) => {
                  const next = [...form.badges];
                  next[idx] = { ...next[idx], text: e.target.value };
                  setForm({ ...form, badges: next });
                }}
                placeholder="Nội dung badge..."
                className="sm:col-span-6 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, badges: form.badges.filter((_, i) => i !== idx) })
                }
                className="sm:col-span-1 p-2 text-[#475569] hover:text-red-600 rounded-[4px] cursor-pointer justify-self-end"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Ghi Chú Đối Tượng Khách Hàng</label>
        <input
          type="text"
          value={form.audience_note}
          onChange={(e) => setForm({ ...form, audience_note: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <ImageUploadField
        label="Ảnh Showcase Hero"
        value={form.image_url}
        onChange={(image_url) => setForm({ ...form, image_url })}
        folder="site"
        helperText="Khuyến nghị tỉ lệ 4:3 (vd: 1200x900px)."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Chú Thích Ảnh (Trái)</label>
          <input
            type="text"
            value={form.caption_left}
            onChange={(e) => setForm({ ...form, caption_left: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Chú Thích Ảnh (Phải)</label>
          <input
            type="text"
            value={form.caption_right}
            onChange={(e) => setForm({ ...form, caption_right: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-[#dce2ea]">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-[#0b132b] font-semibold text-[13px] px-5 py-2.5 rounded-[4px] cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Đang lưu...' : 'Lưu Nội Dung Hero'}</span>
        </button>
      </div>
    </form>
  );
}
