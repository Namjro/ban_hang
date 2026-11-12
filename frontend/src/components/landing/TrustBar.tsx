import React from 'react';
import SiteIcon from '@/components/ui/SiteIcon';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { TrustStatsSettings } from '@/lib/types';

interface TrustBarProps {
  settings?: TrustStatsSettings;
}

export default function TrustBar({ settings = DEFAULT_SITE_SETTINGS.trust_stats }: TrustBarProps) {
  const stats = settings.items;

  return (
    <section className="bg-canvas border-b border-line py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 bg-surface lg:bg-transparent border border-line lg:border-0 lg:border-l-2 lg:border-navy-900/15 rounded-[6px] lg:rounded-none p-3.5 lg:p-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <div className="w-10 h-10 rounded-[4px] bg-surface border border-line flex items-center justify-center text-navy-900 shrink-0 shadow-xs">
                <SiteIcon name={item.icon} className="w-5 h-5 text-navy-900" />
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
          ))}
        </div>
      </div>
    </section>
  );
}
