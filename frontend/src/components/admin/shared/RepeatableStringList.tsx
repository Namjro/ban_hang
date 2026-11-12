'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface RepeatableStringListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  maxItems?: number;
  placeholder?: string;
  helperText?: string;
}

export default function RepeatableStringList({
  label,
  items,
  onChange,
  maxItems = 10,
  placeholder = 'Nhập nội dung...',
  helperText,
}: RepeatableStringListProps) {
  const handleUpdate = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleAdd = () => {
    if (items.length >= maxItems) return;
    onChange([...items, '']);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-[#0b132b]">{label}</label>
        <button
          type="button"
          disabled={items.length >= maxItems}
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0b132b] hover:text-[#d97706] disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm dòng</span>
        </button>
      </div>

      {helperText && <span className="text-[11px] text-[#64748b] -mt-1">{helperText}</span>}

      {items.length === 0 ? (
        <div className="text-[12px] text-[#64748b] bg-[#f8fafc] border border-dashed border-[#dce2ea] rounded-[4px] px-3 py-2.5">
          Chưa có mục nào. Bấm &quot;Thêm dòng&quot; để thêm.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={item}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-w-0 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[16px] sm:text-[13px] text-[#0b132b] focus:outline-none focus:border-[#0b132b]"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#475569] hover:text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer shrink-0"
                title="Xóa dòng"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
