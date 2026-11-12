import React from 'react';
import { Factory, Boxes, CheckCircle2, Truck } from 'lucide-react';

export default function TrustBar() {
  const stats = [
    {
      value: '10+',
      label: 'Năm Kinh Nghiệm',
      icon: Factory,
    },
    {
      value: '1.000+',
      label: 'SKU Có Sẵn',
      icon: Boxes,
    },
    {
      value: '100%',
      label: 'CO/CQ Chính Hãng',
      icon: CheckCircle2,
    },
    {
      value: '24-48h',
      label: 'Giao Hàng Toàn Quốc',
      icon: Truck,
    },
  ];

  return (
    <section className="bg-canvas border-b border-line py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 border-l-2 border-navy-900/15 pl-4 sm:pl-6 first:border-l-0"
              >
                <div className="w-10 h-10 rounded-[4px] bg-surface border border-line flex items-center justify-center text-navy-900 shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 text-navy-900" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[22px] sm:text-[26px] font-bold text-ink leading-tight">
                    {item.value}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-ink-muted font-medium leading-normal">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
