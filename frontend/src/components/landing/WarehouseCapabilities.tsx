import React from 'react';
import Image from 'next/image';
import { PackageCheck } from 'lucide-react';
import SiteIcon from '@/components/ui/SiteIcon';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { CapabilitiesSettings } from '@/lib/types';

interface WarehouseCapabilitiesProps {
  settings?: CapabilitiesSettings;
}

export default function WarehouseCapabilities({
  settings = DEFAULT_SITE_SETTINGS.capabilities,
}: WarehouseCapabilitiesProps) {
  return (
    <section id="capabilities" className="bg-surface py-16 lg:py-24 border-b border-line">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center gap-12 lg:gap-[72px]">
        {/* Left column: Warehouse Photography */}
        <div className="flex-1 w-full max-w-[612px]">
          <div className="relative h-[340px] sm:h-[420px] rounded-[8px] overflow-hidden border border-line shadow-axiom-card">
            <Image
              src={settings.image_url || '/assets/images/warehouse.png'}
              alt={settings.title}
              fill
              unoptimized={Boolean(settings.image_url?.startsWith('http'))}
              className="object-cover"
            />
            {settings.image_caption && (
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-navy-900/95 text-white px-4 py-3 rounded-[4px] flex items-center gap-2.5 shadow-md">
                <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-[13px] font-medium">{settings.image_caption}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Supply Capabilities Details */}
        <div className="flex-1 max-w-[620px] flex flex-col gap-5">
          <span className="text-ink-muted text-[12px] font-semibold tracking-[1.4px] uppercase">
            {settings.eyebrow}
          </span>

          <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-[-0.03em] leading-[1.15]">
            {settings.title}
          </h2>

          <p className="text-ink-muted text-[14px] leading-[1.6]">{settings.description}</p>

          <div className="flex flex-col gap-4 pt-2">
            {settings.items.map((cap, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-[4px] bg-canvas border border-line flex items-center justify-center text-navy-900 shrink-0 mt-0.5">
                  <SiteIcon name={cap.icon} className="w-5 h-5 text-navy-900" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[15px] font-semibold text-ink">{cap.title}</h3>
                  <p className="text-ink-muted text-[13px] leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
