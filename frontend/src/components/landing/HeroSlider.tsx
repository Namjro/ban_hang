'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';

interface HeroSliderProps {
  slides: HeroSlide[];
  title: string;
}

const AUTOPLAY_INTERVAL_MS = 4500;
const SWIPE_THRESHOLD_PX = 40;

export default function HeroSlider({ slides, title }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = slides.length;
  const safeIndex = count > 0 ? activeIndex % count : 0;

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = window.setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, goNext]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    setPaused(false);

    if (startX === null || endX === null) return;
    const delta = startX - endX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta > 0) goNext();
    else goPrev();
  };

  const currentSlide = slides[safeIndex] || slides[0];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden border border-line-dark bg-navy-800 group focus:outline-none focus:ring-2 focus:ring-amber-500"
    >
      {/* Slides track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${safeIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative w-full h-full shrink-0">
            <Image
              src={slide.image_url || '/assets/images/cnc-machinery.png'}
              alt={slide.caption_left ? `${title} - ${slide.caption_left}` : title}
              fill
              className="object-cover"
              unoptimized={Boolean(slide.image_url?.startsWith('http'))}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Bottom gradient & captions */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
        <span className="font-mono text-[12px] font-semibold text-white tracking-wider uppercase truncate">
          {currentSlide?.caption_left}
        </span>
        <span className="font-mono text-[12px] text-amber-500 font-semibold shrink-0">
          {currentSlide?.caption_right}
        </span>
      </div>

      {/* Controls (only when multiple slides) */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Slide trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/75 hover:bg-navy-900 text-white border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Slide tiếp theo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/75 hover:bg-navy-900 text-white border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-navy-900/70 backdrop-blur-[2px] px-2.5 py-1.5 rounded-full border border-white/10"
            role="tablist"
            aria-label="Chọn slide"
          >
            {slides.map((_, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isActive ? 'w-5 bg-amber-500' : 'w-2 bg-white/45 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
