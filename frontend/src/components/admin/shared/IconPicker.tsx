'use client';

import React from 'react';
import SiteIcon from '@/components/ui/SiteIcon';
import SelectField from '@/components/ui/SelectField';
import { SITE_ICON_OPTIONS } from '@/constants';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  return (
    <div className={`flex items-center gap-2 min-w-0 max-w-full ${className}`}>
      <div className="w-10 h-10 rounded-[4px] border border-[#dce2ea] bg-[#f8fafc] flex items-center justify-center shrink-0 text-[#0b132b]">
        <SiteIcon name={value} className="w-4 h-4" />
      </div>
      <SelectField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        wrapperClassName="flex-1 min-w-0"
      >
        {SITE_ICON_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </SelectField>
    </div>
  );
}
