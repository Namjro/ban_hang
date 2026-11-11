'use client';

import React from 'react';
import Image from 'next/image';
import { Check, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';

interface ProductCardProps {
  product: Product;
  index?: number;
  onRequestQuote: (sku: string) => void;
}

export default function ProductCard({ product, index = 0, onRequestQuote }: ProductCardProps) {
  const fallbackImg = SAMPLE_PRODUCT_IMAGES[index % SAMPLE_PRODUCT_IMAGES.length];
  const primaryImg =
    (Array.isArray(product.images) && product.images[0]) || product.image_url || fallbackImg;
  const imageCount = Array.isArray(product.images)
    ? product.images.length
    : product.image_url
      ? 1
      : 0;

  return (
    <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-[#0b132b] transition-all duration-200 group shadow-2xs hover:shadow-md">
      <div>
        {/* Product Image Area */}
        <a
          href={`/products/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#f8fafc] h-[190px] relative overflow-hidden flex items-center justify-center p-3 border-b border-[#dce2ea] block cursor-pointer"
          title="Bấm để mở chi tiết sản phẩm ở tab mới"
        >
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            unoptimized={primaryImg.startsWith('data:') || primaryImg.startsWith('http')}
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges on image */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            <span className="bg-[#0b132b] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] tracking-wide">
              {product.sku}
            </span>
            {imageCount > 1 && (
              <span className="bg-[#152039]/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-[2px]">
                {imageCount} ảnh
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            {product.stock_status === 'in_stock' ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Có sẵn
              </span>
            ) : product.stock_status === 'low_stock' ? (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                Sắp hết
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                Đặt hàng
              </span>
            )}
          </div>
        </a>

        {/* Details */}
        <div className="p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#475569]">
            <span>{product.category?.name || 'Vật Tư Công Nghiệp'}</span>
            <span className="font-semibold text-[#0b132b]">{product.brand}</span>
          </div>

          <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-bold text-[#0b132b] leading-snug line-clamp-2 min-h-[40px] group-hover:text-[#d97706] transition-colors block"
            title="Bấm để mở chi tiết sản phẩm ở tab mới"
          >
            {product.name}
          </a>

          {/* Specs Snapshot */}
          {product.specifications && (
            <div className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 flex flex-col gap-1 text-[11px] text-[#475569]">
              {Object.entries(product.specifications)
                .slice(0, 2)
                .map(([key, val], sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between">
                    <span className="text-[#94a3b8] truncate pr-2">{key}:</span>
                    <span className="font-medium text-[#0b132b] truncate">{val}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer card action */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-2 border-t border-[#dce2ea] gap-2">
          <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#475569] hover:text-[#0b132b] text-[11px] font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Chi tiết</span>
            <ArrowUpRight className="w-3 h-3 text-[#94a3b8]" />
          </a>

          <button
            onClick={() => onRequestQuote(product.sku)}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[12px] h-[34px] px-3 rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <span>Báo Giá</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
