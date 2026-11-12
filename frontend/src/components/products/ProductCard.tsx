'use client';

import React from 'react';
import Link from 'next/link';
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

  return (
    <article className="bg-surface border border-line rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-navy-900 transition-colors duration-200 group shadow-axiom-card hover:shadow-md">
      <div>
        {/* Product Image Area */}
        <Link
          href={`/products/${product.slug}`}
          className="bg-canvas h-[196px] relative overflow-hidden flex items-center justify-center p-4 border-b border-line block"
        >
          <Image
            src={primaryImg}
            alt={`${product.name} - Mã ${product.sku} - ${product.brand}`}
            fill
            unoptimized={primaryImg.startsWith('data:') || primaryImg.startsWith('http')}
            className="object-contain p-3"
          />

          {/* Top badges: SKU & Stock status */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-navy-900 text-white font-mono text-[12px] font-bold px-2 py-0.5 rounded-[4px] tracking-wide">
              {product.sku}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            {product.stock_status === 'in_stock' ? (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[12px] font-semibold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Có sẵn
              </span>
            ) : product.stock_status === 'low_stock' ? (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[12px] font-semibold px-2 py-0.5 rounded-[4px]">
                Sắp hết
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[12px] font-semibold px-2 py-0.5 rounded-[4px]">
                Đặt hàng
              </span>
            )}
          </div>
        </Link>

        {/* Details */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 text-[12px] text-ink-muted">
            <span className="truncate">{product.category?.name || 'Vật Tư Công Nghiệp'}</span>
            <span className="font-semibold text-ink shrink-0">{product.brand}</span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-[15px] font-bold text-ink leading-snug line-clamp-2 min-h-[42px] group-hover:text-amber-600 transition-colors block"
          >
            {product.name}
          </Link>

          {/* Specs Snapshot */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <dl className="bg-canvas border border-line rounded-[4px] p-2.5 flex flex-col gap-1.5 text-[12px]">
              {Object.entries(product.specifications)
                .slice(0, 2)
                .map(([key, val], sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between gap-2">
                    <dt className="text-ink-dim truncate">{key}:</dt>
                    <dd className="font-medium text-ink truncate text-right">{val}</dd>
                  </div>
                ))}
            </dl>
          )}
        </div>
      </div>

      {/* Footer card action */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink text-[13px] font-medium min-h-[44px] px-1 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Chi tiết</span>
          </Link>

          <button
            type="button"
            onClick={() => onRequestQuote(product.sku)}
            className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold text-[13px] min-h-[44px] px-3.5 rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98] shrink-0"
          >
            <span>Báo Giá</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
