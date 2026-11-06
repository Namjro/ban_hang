'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="bg-white border-b border-[#dce2ea] sticky top-0 z-40 w-full transition-shadow">
      <div className="max-w-[1440px] mx-auto h-[80px] md:h-[96px] px-4 sm:px-8 lg:px-[72px] flex items-center justify-between gap-4">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-[38px] h-[38px] rounded-[4px] border-2 border-[#0b132b] flex items-center justify-center bg-white group-hover:bg-[#0b132b] transition-colors">
            {/* Hexagon Precision Mark */}
            <svg
              className="w-5 h-5 text-[#0b132b] group-hover:text-[#f59e0b] transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] md:text-[24px] font-bold text-[#0b132b] tracking-[1.5px] leading-none">
              AXIOM
            </span>
            <span className="text-[8px] font-semibold tracking-[1.6px] text-[#475569] uppercase mt-0.5">
              INDUSTRIAL SUPPLY
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] text-[#0b132b] font-medium">
          <Link href="/products" className="hover:text-[#f59e0b] transition-colors py-2">
            Sản Phẩm
          </Link>
          <a href="#quick-specs" className="hover:text-[#f59e0b] transition-colors py-2">
            Thông Số Kỹ Thuật
          </a>
          <a href="#capabilities" className="hover:text-[#f59e0b] transition-colors py-2">
            Năng Lực
          </a>
          <button
            onClick={onOpenQuoteModal}
            className="hover:text-[#f59e0b] transition-colors py-2 text-left"
          >
            Liên Hệ
          </button>
        </nav>

        {/* Procurement actions */}
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2.5 h-[44px] w-[220px] lg:w-[264px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 focus-within:border-[#0b132b] focus-within:ring-1 focus-within:ring-[#0b132b] transition-all"
          >
            <Search className="w-4 h-4 text-[#475569] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã model, SKU, thông số..."
              className="bg-transparent text-[12px] text-[#0b132b] placeholder-[#94a3b8] w-full focus:outline-none"
            />
          </form>

          {/* Action button */}
          <button
            onClick={onOpenQuoteModal}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[13px] sm:text-[14px] h-[44px] md:h-[50px] px-4 md:px-5 rounded-[4px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Yêu Cầu Báo Giá</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
