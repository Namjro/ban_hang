'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/lib/types';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imagesList: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [SAMPLE_PRODUCT_IMAGES[product.id % SAMPLE_PRODUCT_IMAGES.length]];

  const currentImage = imagesList[activeImageIndex] || imagesList[0] || SAMPLE_PRODUCT_IMAGES[0];

  return (
    <div className="lg:col-span-5 bg-white border border-[#dce2ea] rounded-[8px] p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Main Viewport */}
      <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[440px] bg-[#f8fafc] rounded-[6px] border border-[#dce2ea] overflow-hidden flex items-center justify-center p-4 sm:p-6 group">
        <Image
          src={currentImage}
          alt={`${product.name} - Mã ${product.sku} - ${product.brand}`}
          fill
          priority
          unoptimized={currentImage.startsWith('data:') || currentImage.startsWith('http')}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges on Main Image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#0b132b] text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-[2px] tracking-wider shadow-xs">
            {product.sku}
          </span>
          <span className="bg-[#152039] text-[#f59e0b] border border-[#475569] text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
            {product.brand}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          {product.stock_status === 'in_stock' ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px] flex items-center gap-1 shadow-2xs">
              <Check className="w-3.5 h-3.5" /> Có sẵn trong kho
            </span>
          ) : product.stock_status === 'low_stock' ? (
            <span className="bg-amber-50 text-amber-700 border border-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
              Sắp hết hàng
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
              Đặt hàng theo lịch
            </span>
          )}
        </div>

        {/* Navigation arrows for images if multiple */}
        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-[#dce2ea] text-[#0b132b] flex items-center justify-center hover:bg-[#0b132b] hover:text-white transition-all cursor-pointer shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/95 border border-[#dce2ea] text-[#0b132b] flex items-center justify-center hover:bg-[#0b132b] hover:text-white transition-all cursor-pointer shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Ảnh kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {imagesList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {imagesList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-[72px] h-[72px] rounded-[4px] border overflow-hidden shrink-0 bg-[#f8fafc] transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-[#0b132b] ring-2 ring-[#0b132b] scale-102'
                  : 'border-[#dce2ea] hover:border-[#0b132b]/60 opacity-80 hover:opacity-100'
              }`}
              aria-label={`Xem ảnh ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`Ảnh góc ${idx + 1}`}
                fill
                unoptimized={img.startsWith('data:') || img.startsWith('http')}
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Quality & Origin Banner */}
      <div className="bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] p-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#475569]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <span>Hồ sơ CO/CQ đầy đủ</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#0b132b]" />
          <span>Giao nhanh 24-48h</span>
        </div>
      </div>
    </div>
  );
}
