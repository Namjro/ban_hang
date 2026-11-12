'use client';

import React from 'react';
import { Award, Check, Layers, Plus, Trash2, X } from 'lucide-react';
import { PRESET_CERTIFICATES } from '@/constants';
import { ProductFormState } from './types';

interface ProductSpecsSectionProps {
  form: ProductFormState;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export default function ProductSpecsSection({ form, onChange }: ProductSpecsSectionProps) {
  const handleAddSpecRow = () => {
    onChange({ specRows: [...form.specRows, { key: '', value: '' }] });
  };

  const handleUpdateSpecRow = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...form.specRows];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ specRows: updated });
  };

  const handleRemoveSpecRow = (idx: number) => {
    onChange({ specRows: form.specRows.filter((_, i) => i !== idx) });
  };

  const handleToggleCertificate = (cert: string) => {
    const exists = form.certificates.includes(cert);
    onChange({
      certificates: exists
        ? form.certificates.filter((c) => c !== cert)
        : [...form.certificates, cert],
    });
  };

  const handleAddCustomCert = () => {
    const val = form.customCertInput.trim();
    if (!val) return;
    if (!form.certificates.includes(val)) {
      onChange({ certificates: [...form.certificates, val], customCertInput: '' });
    } else {
      onChange({ customCertInput: '' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic Technical Specifications */}
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
            <span>Thêm Dòng</span>
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

      {/* Certificates */}
      <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
            <Award className="w-4 h-4 text-[#f59e0b]" />
            <span>Chứng Chỉ &amp; Tiêu Chuẩn Xuất Xưởng ({form.certificates.length})</span>
          </div>
          <span className="text-[11px] text-[#475569]">Hiển thị trên web</span>
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
            onChange={(e) => onChange({ customCertInput: e.target.value })}
            placeholder="Nhập tên chứng chỉ tiêu chuẩn khác..."
            className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0b132b]"
          />
          <button
            type="button"
            onClick={handleAddCustomCert}
            className="bg-white border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] text-[12px] px-3 py-1.5 rounded-[4px] font-medium shrink-0 cursor-pointer"
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
                  onClick={() =>
                    onChange({ certificates: form.certificates.filter((item) => item !== c) })
                  }
                  className="hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
