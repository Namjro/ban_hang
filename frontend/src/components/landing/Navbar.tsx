'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-40 w-full">
      <div className="max-w-[1440px] mx-auto h-[72px] px-4 sm:px-8 lg:px-[72px] flex items-center justify-between gap-4">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-[38px] h-[38px] rounded-[4px] border-2 border-navy-900 flex items-center justify-center bg-surface group-hover:bg-navy-900 transition-colors">
            <svg
              className="w-5 h-5 text-navy-900 group-hover:text-amber-500 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] sm:text-[22px] font-bold text-ink tracking-[1.5px] leading-none">
              AXIOM
            </span>
            <span className="text-[12px] font-semibold tracking-[0.8px] text-ink-muted uppercase mt-0.5 leading-none">
              INDUSTRIAL SUPPLY
            </span>
          </div>
        </Link>

        {/* Desktop navigation links */}
        <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-7 text-[14px] text-ink font-medium">
          <Link href="/products" className="hover:text-amber-600 transition-colors py-2">
            Sản Phẩm
          </Link>
          <a href="#quick-specs" className="hover:text-amber-600 transition-colors py-2">
            Thông Số Kỹ Thuật
          </a>
          <a href="#capabilities" className="hover:text-amber-600 transition-colors py-2">
            Năng Lực
          </a>
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="hover:text-amber-600 transition-colors py-2 text-left cursor-pointer"
          >
            Liên Hệ
          </button>
        </nav>

        {/* Procurement actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2.5 h-[44px] w-[220px] lg:w-[260px] bg-canvas border border-line rounded-[4px] px-3 focus-within:border-navy-900 focus-within:ring-1 focus-within:ring-navy-900 transition-colors"
          >
            <Search className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã model, SKU..."
              aria-label="Tìm kiếm mã model hoặc SKU"
              className="bg-transparent text-[13px] text-ink placeholder:text-ink-dim w-full focus:outline-none"
            />
          </form>

          <Button onClick={onOpenQuoteModal} size="md" className="hidden sm:inline-flex">
            <span>Yêu Cầu Báo Giá</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="lg:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-[4px] border border-line bg-surface text-ink hover:bg-canvas transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-surface border-t border-line px-4 sm:px-8 py-5 flex flex-col gap-4 shadow-axiom-modal"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2.5 h-[44px] w-full bg-canvas border border-line rounded-[4px] px-3 focus-within:border-navy-900"
          >
            <Search className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã model, SKU, thông số..."
              aria-label="Tìm kiếm sản phẩm"
              className="bg-transparent text-[14px] text-ink placeholder:text-ink-dim w-full focus:outline-none"
            />
          </form>

          <nav aria-label="Điều hướng di động" className="flex flex-col divide-y divide-line text-[15px] font-medium text-ink">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 min-h-[44px] flex items-center justify-between hover:text-amber-600"
            >
              <span>Sản Phẩm</span>
              <ArrowUpRight className="w-4 h-4 text-ink-dim" />
            </Link>
            <a
              href="#quick-specs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 min-h-[44px] flex items-center hover:text-amber-600"
            >
              Thông Số Kỹ Thuật
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 min-h-[44px] flex items-center hover:text-amber-600"
            >
              Năng Lực Cung Ứng
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="py-3 min-h-[44px] flex items-center text-left hover:text-amber-600 cursor-pointer"
            >
              Liên Hệ Kỹ Thuật
            </button>
          </nav>

          <Button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuoteModal();
            }}
            size="lg"
            className="w-full"
          >
            <span>Yêu Cầu Báo Giá</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </header>
  );
}
