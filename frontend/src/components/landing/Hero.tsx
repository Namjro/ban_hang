'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SiteIcon from '@/components/ui/SiteIcon';
import HeroSlider from '@/components/landing/HeroSlider';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { HeroSettings, HeroSlide } from '@/lib/types';

interface HeroProps {
  onOpenQuoteModal?: () => void;
  settings?: HeroSettings;
}

export default function Hero({ onOpenQuoteModal, settings = DEFAULT_SITE_SETTINGS.hero }: HeroProps) {
  const router = useRouter();
  const [skuQuery, setSkuQuery] = useState('');

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (skuQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(skuQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const resolvedSlides: HeroSlide[] =
    settings.slides && settings.slides.length > 0
      ? settings.slides
      : [
          {
            image_url: settings.image_url || '/assets/images/cnc-machinery.png',
            caption_left: settings.caption_left || '',
            caption_right: settings.caption_right || '',
          },
        ];

  return (
    <section className="bg-navy-900 text-white overflow-hidden py-12 md:py-16 lg:py-20 border-b border-navy-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* Left column: Value Proposition, SKU Quick Search & CTAs */}
        <div className="flex-1 max-w-[650px] flex flex-col items-start gap-6">
          <span className="text-ink-subtle text-[12px] font-semibold tracking-[1.4px] uppercase">
            {settings.eyebrow}
          </span>

          <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold text-white tracking-[-0.03em] leading-[1.1] sm:leading-[1.08]">
            {settings.title}
          </h1>

          <p className="text-ink-subtle text-[15px] sm:text-[16px] leading-[1.65] font-normal">
            {settings.subtitle}
          </p>

          {/* Assurance badges */}
          <div className="flex flex-wrap items-center gap-3">
            {settings.badges.map((badge, idx) => (
              <Badge key={idx} variant="assurance">
                <SiteIcon
                  name={badge.icon}
                  className={`w-4 h-4 shrink-0 ${idx % 2 === 0 ? 'text-amber-500' : 'text-emerald-400'}`}
                />
                <span>{badge.text}</span>
              </Badge>
            ))}
          </div>

          {/* Quick SKU / Model Search Bar for B2B buyers */}
          <form
            onSubmit={handleQuickLookup}
            className="w-full max-w-[520px] flex flex-col sm:flex-row gap-2.5 pt-1"
          >
            <div className="flex-1 flex items-center gap-2.5 h-[50px] bg-navy-800 border border-line-dark rounded-[4px] px-3.5 focus-within:border-amber-500 transition-colors">
              <Search className="w-4 h-4 text-ink-subtle shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={skuQuery}
                onChange={(e) => setSkuQuery(e.target.value)}
                placeholder="Nhập mã SKU, model máy hoặc quy cách..."
                aria-label="Tra cứu nhanh mã SKU hoặc model máy"
                className="bg-transparent text-[14px] text-white placeholder:text-slate-300 w-full focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="sm:w-auto w-full">
              <span>Tra Cứu Kho</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>

          {/* Secondary actions */}
          <div className="flex flex-wrap items-center gap-4 pt-1 w-full sm:w-auto">
            <Button href="/products" variant="outline-dark" size="md" className="w-full sm:w-auto">
              <span>Xem Toàn Bộ Danh Mục</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>

            {onOpenQuoteModal && (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-subtle hover:text-amber-500 transition-colors min-h-[44px] px-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Nhận Catalogue &amp; Báo Giá B2B</span>
              </button>
            )}
          </div>

          <p className="text-slate-300 text-[13px]">
            {settings.audience_note}
          </p>
        </div>

        {/* Right column: Machinery showcase slider */}
        <div className="flex-1 w-full max-w-[600px]">
          <HeroSlider slides={resolvedSlides} title={settings.title} />
        </div>
      </div>
    </section>
  );
}
