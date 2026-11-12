'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';

interface RelatedProductsSectionProps {
  categoryName?: string;
  products: Product[];
}

export default function RelatedProductsSection({
  categoryName,
  products,
}: RelatedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-[12px] font-bold text-ink-muted uppercase tracking-wider">
            DANH MỤC TƯƠNG ĐỒNG
          </span>
          <h2 className="text-[20px] font-bold text-ink mt-1">
            Sản Phẩm Cùng Nhóm {categoryName}
          </h2>
        </div>

        <Link
          href="/products"
          className="text-[13px] font-semibold text-ink hover:text-amber-600 inline-flex items-center gap-1 min-h-[44px] transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((rel, rIdx) => {
          const relImg =
            (Array.isArray(rel.images) && rel.images[0]) ||
            rel.image_url ||
            SAMPLE_PRODUCT_IMAGES[rIdx % SAMPLE_PRODUCT_IMAGES.length];

          return (
            <article
              key={rel.id}
              className="bg-surface border border-line rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-navy-900 transition-colors group shadow-axiom-card hover:shadow-md"
            >
              <div>
                <Link
                  href={`/products/${rel.slug}`}
                  className="relative h-[160px] bg-canvas border-b border-line flex items-center justify-center p-3 block"
                >
                  <Image
                    src={relImg}
                    alt={rel.name}
                    fill
                    unoptimized={relImg.startsWith('data:') || relImg.startsWith('http')}
                    className="object-contain p-2"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-navy-900 text-white font-mono text-[12px] font-bold px-2 py-0.5 rounded-[4px]">
                    {rel.sku}
                  </span>
                </Link>

                <div className="p-3.5 flex flex-col gap-1.5">
                  <span className="text-[12px] text-ink-muted font-medium">{rel.brand}</span>
                  <Link
                    href={`/products/${rel.slug}`}
                    className="text-[14px] font-bold text-ink hover:text-amber-600 line-clamp-2 leading-snug transition-colors"
                  >
                    {rel.name}
                  </Link>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <div className="flex items-center justify-between pt-2.5 border-t border-line">
                  <span className="text-[12px] font-semibold text-emerald-700">CO/CQ đầy đủ</span>
                  <Link
                    href={`/products/${rel.slug}`}
                    className="text-[12px] font-semibold text-ink hover:text-amber-600 inline-flex items-center gap-0.5 min-h-[44px] px-1"
                  >
                    <span>Chi tiết</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
