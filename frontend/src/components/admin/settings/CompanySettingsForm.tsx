'use client';

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { CompanySettings } from '@/lib/types';

interface CompanySettingsFormProps {
  initialData: CompanySettings;
  saving: boolean;
  onSave: (data: CompanySettings) => Promise<void>;
}

export default function CompanySettingsForm({
  initialData,
  saving,
  onSave,
}: CompanySettingsFormProps) {
  const [form, setForm] = useState<CompanySettings>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Tên Công Ty *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Email Báo Giá *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Hotline Hiển Thị *</label>
          <input
            type="text"
            required
            value={form.hotline_display}
            onChange={(e) => setForm({ ...form, hotline_display: e.target.value })}
            placeholder="0988.123.456"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Số Gọi (tel:) *</label>
          <input
            type="text"
            required
            value={form.hotline_tel}
            onChange={(e) => setForm({ ...form, hotline_tel: e.target.value })}
            placeholder="0988123456"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b] font-mono"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Ghi Chú Hotline</label>
          <input
            type="text"
            value={form.hotline_note}
            onChange={(e) => setForm({ ...form, hotline_note: e.target.value })}
            placeholder="24/7"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Địa Chỉ Kho / Trụ Sở *</label>
        <input
          type="text"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Đường Dẫn Zalo</label>
          <input
            type="url"
            value={form.zalo_url}
            onChange={(e) => setForm({ ...form, zalo_url: e.target.value })}
            placeholder="https://zalo.me/..."
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Tên Hiển Thị Zalo</label>
          <input
            type="text"
            value={form.zalo_label}
            onChange={(e) => setForm({ ...form, zalo_label: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-[#0b132b]">Giới Thiệu Ngắn (Footer)</label>
        <textarea
          rows={3}
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Bản Quyền (Copyright)</label>
          <input
            type="text"
            value={form.copyright}
            onChange={(e) => setForm({ ...form, copyright: e.target.value })}
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#0b132b]">Chứng Nhận Footer</label>
          <input
            type="text"
            value={form.footer_badge}
            onChange={(e) => setForm({ ...form, footer_badge: e.target.value })}
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
          <span>{saving ? 'Đang lưu...' : 'Lưu Thông Tin Công Ty'}</span>
        </button>
      </div>
    </form>
  );
}
