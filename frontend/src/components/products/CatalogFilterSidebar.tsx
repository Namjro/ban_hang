'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
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
  return (
    <aside className="w-full lg:w-[280px] bg-white border border-[#dce2ea] rounded-[8px] p-5 shrink-0 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
        <div className="flex items-center gap-2 text-[#0b132b] font-bold text-[14px]">
          <SlidersHorizontal className="w-4 h-4 text-[#0b132b]" />
          <span>Bộ lọc sản phẩm</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[12px] text-[#475569] hover:text-[#0b132b] flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="py-4 border-b border-[#dce2ea] flex flex-col gap-3">
        <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
          Nhóm Sản Phẩm
        </span>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onSelectCategory('')}
            className={`text-left text-[13px] py-1 px-2 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-[#0b132b] text-white font-semibold'
                : 'text-[#475569] hover:bg-[#f8fafc]'
            }`}
          >
            <span>Tất cả danh mục</span>
            <span className="text-[11px] opacity-75">{totalProducts}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-left text-[13px] py-1 px-2 rounded-[4px] flex items-center justify-between transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#0b132b] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className="text-[11px] opacity-75">{cat.products_count ?? 9}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="py-4 border-b border-[#dce2ea] flex flex-col gap-3">
        <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
          Tình Trạng Kho
        </span>
        <div className="flex flex-col gap-2">
          {STOCK_FILTER_OPTIONS.map((st) => (
            <label
              key={st.val}
              className="flex items-center gap-2.5 text-[13px] text-[#475569] cursor-pointer hover:text-[#0b132b]"
            >
              <input
                type="radio"
                name="stock_filter"
                checked={selectedStock === st.val}
                onChange={() => onSelectStock(st.val)}
                className="accent-[#0b132b]"
              />
              <span>{st.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 flex flex-col gap-3">
        <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
          Thương Hiệu
        </span>
        <div className="flex flex-col gap-2">
          {BRAND_FILTER_OPTIONS.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2.5 text-[13px] text-[#475569] cursor-pointer hover:text-[#0b132b]"
            >
              <input
                type="radio"
                name="brand_filter"
                checked={selectedBrand === b}
                onChange={() => onSelectBrand(b)}
                className="accent-[#0b132b]"
              />
              <span>{b || 'Tất cả thương hiệu'}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
