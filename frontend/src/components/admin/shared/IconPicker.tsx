'use client';

import React from 'react';
import SiteIcon from '@/components/ui/SiteIcon';
import { SITE_ICON_OPTIONS } from '@/constants';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-[4px] border border-[#dce2ea] bg-[#f8fafc] flex items-center justify-center shrink-0 text-[#0b132b]">
        <SiteIcon name={value} className="w-4 h-4" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-2.5 py-2 text-[13px] text-[#0b132b] focus:outline-none focus:border-[#0b132b]"
      >
        {SITE_ICON_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
