'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import { Category } from '@/lib/types';
import { BRAND_FILTER_OPTIONS, STOCK_FILTER_OPTIONS } from '@/constants';

interface CatalogFilterSidebarProps {
  categories: Category[];
  totalProducts: number;
  selectedCategory: string;
  selectedStock: string;
  selectedBrand: string;
  onSelectCategory: (slug: string) => void;
  onSelectStock: (stock: string) => void;
  onSelectBrand: (brand: string) => void;
  onResetFilters: () => void;
}

export default function CatalogFilterSidebar({
  categories,
  totalProducts,
  selectedCategory,
  selectedStock,
  selectedBrand,
  onSelectCategory,
  onSelectStock,
  onSelectBrand,
  onResetFilters,
}: CatalogFilterSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const activeCount =
    (selectedCategory ? 1 : 0) + (selectedStock ? 1 : 0) + (selectedBrand ? 1 : 0);

  return (
    <aside className="w-full lg:w-[280px] bg-surface border border-line rounded-[8px] p-4 sm:p-5 shrink-0 shadow-axiom-card">
      <div className="flex items-center justify-between gap-2 pb-3 lg:pb-4 border-b border-line">
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          aria-expanded={mobileExpanded}
          className="flex items-center gap-2 text-ink font-bold text-[14px] min-h-[44px] lg:min-h-0 lg:pointer-events-none cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-ink" aria-hidden="true" />
          <span>Bộ lọc sản phẩm</span>
          {activeCount > 0 && (
            <span className="bg-amber-500 text-navy-900 text-[12px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-ink-muted lg:hidden transition-transform ${
              mobileExpanded ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-[12px] text-ink-muted hover:text-ink inline-flex items-center gap-1 font-medium transition-colors min-h-[44px] px-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className={`${mobileExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Category Filter */}
        <div className="py-4 border-b border-line flex flex-col gap-3">
          <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
            Nhóm Sản Phẩm
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className={`text-left text-[13px] min-h-[44px] px-3 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'text-ink-muted hover:bg-canvas'
              }`}
            >
              <span>Tất cả danh mục</span>
              <span className="text-[12px] opacity-80">{totalProducts}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`text-left text-[13px] min-h-[44px] px-3 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'text-ink-muted hover:bg-canvas'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="text-[12px] opacity-80">{cat.products_count ?? 9}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stock Status Filter */}
        <div className="py-4 border-b border-line flex flex-col gap-3">
          <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
            Tình Trạng Kho
          </span>
          <div className="flex flex-col gap-1">
            {STOCK_FILTER_OPTIONS.map((st) => (
              <label
                key={st.val}
                className="flex items-center gap-2.5 text-[13px] text-ink-muted cursor-pointer hover:text-ink min-h-[40px] px-1"
              >
                <input
                  type="radio"
                  name="stock_filter"
                  checked={selectedStock === st.val}
                  onChange={() => onSelectStock(st.val)}
                  className="accent-navy-900 w-4 h-4"
                />
                <span>{st.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="pt-4 flex flex-col gap-3">
          <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
            Thương Hiệu
          </span>
          <div className="flex flex-col gap-1">
            {BRAND_FILTER_OPTIONS.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2.5 text-[13px] text-ink-muted cursor-pointer hover:text-ink min-h-[40px] px-1"
              >
                <input
                  type="radio"
                  name="brand_filter"
                  checked={selectedBrand === b}
                  onChange={() => onSelectBrand(b)}
                  className="accent-navy-900 w-4 h-4"
                />
                <span>{b || 'Tất cả thương hiệu'}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
