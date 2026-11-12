'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { Category, CompanySettings } from '@/lib/types';
import { categoryService } from '@/services';

interface FooterProps {
  company?: CompanySettings;
  categories?: Category[];
}

const FALLBACK_FOOTER_CATEGORIES = [
  { name: 'Máy CNC & Máy Công Cụ', slug: 'may-cnc-va-may-cong-cu' },
  { name: 'Dụng Cụ Cắt Gọt', slug: 'dung-cu-cat-got' },
  { name: 'Đo Lường Chính Xác', slug: 'do-luong-chinh-xac' },
  { name: 'Gá Đặt & Phụ Kiện Máy', slug: 'ga-dat-va-phu-kien-may' },
  { name: 'Bạc Đạn & Ray Trượt', slug: 'bac-dan-va-truyen-dong' },
  { name: 'Bôi Trơn & Khí Nén', slug: 'boi-tron-va-khi-nen' },
];

export default function Footer({
  company = DEFAULT_SITE_SETTINGS.company,
  categories,
}: FooterProps) {
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories) return;
    let isMounted = true;
    categoryService
      .getPublicCategories({ home: true })
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          setFetchedCategories(res.data);
        }
      })
      .catch(() => {
        // Fallback links will be used
      });
    return () => {
      isMounted = false;
    };
  }, [categories]);

  const categoryLinks =
    (categories && categories.length > 0 ? categories : fetchedCategories).length > 0
      ? (categories && categories.length > 0 ? categories : fetchedCategories).map((c) => ({
          name: c.name,
          slug: c.slug,
        }))
      : FALLBACK_FOOTER_CATEGORIES;

  return (
    <footer className="bg-navy-900 text-white border-t border-navy-800 py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-[4px] border-2 border-amber-500 flex items-center justify-center bg-transparent">
                <svg
                  className="w-4 h-4 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] font-bold text-white tracking-[1.5px] leading-none">
                  AXIOM
                </span>
                <span className="text-[12px] font-semibold tracking-[0.8px] text-ink-subtle uppercase mt-0.5 leading-none">
                  INDUSTRIAL SUPPLY
                </span>
              </div>
            </div>

            <p className="text-ink-subtle text-[13px] leading-relaxed max-w-[480px]">
              {company.tagline}
            </p>

            <div className="flex flex-col gap-1.5 text-[13px] text-ink-subtle">
              <p>Kho hàng trung tâm: {company.address}</p>
              <p>
                Hotline Kỹ Thuật: {company.hotline_display}
                {company.hotline_note ? ` (${company.hotline_note})` : ''}
              </p>
              <p>Email Báo Giá: {company.email}</p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-[13px] font-semibold uppercase tracking-wider">
              Danh Mục Sản Phẩm
            </span>
            <ul className="flex flex-col gap-2 text-[13px] text-ink-subtle">
              {categoryLinks.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal & Support */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-[13px] font-semibold uppercase tracking-wider">
              Hệ Thống &amp; Hỗ Trợ
            </span>
            <ul className="flex flex-col gap-2 text-[13px] text-ink-subtle">
              <li>
                <Link href="/products" className="hover:text-amber-500 transition-colors">
                  Tra Cứu Mã SKU
                </Link>
              </li>
              <li>
                <Link href="/#quick-specs" className="hover:text-amber-500 transition-colors">
                  Bảng Thông Số Kỹ Thuật
                </Link>
              </li>
              <li>
                <Link href="/#quote-request" className="hover:text-amber-500 transition-colors">
                  Gửi Yêu Cầu Báo Giá B2B
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-[4px] bg-navy-800 border border-line-dark text-amber-500 hover:border-amber-500 text-[13px] font-medium transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Đăng Nhập CMS Quản Trị</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-ink-subtle">
          <p>{company.copyright}</p>
          <p className="font-mono text-[12px]">{company.footer_badge}</p>
        </div>
      </div>
    </footer>
  );
}
