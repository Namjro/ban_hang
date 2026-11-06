'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, PackageCheck, Download, ArrowRight, Crosshair } from 'lucide-react';

interface HeroProps {
  onOpenQuoteModal: () => void;
}

export default function Hero({ onOpenQuoteModal }: HeroProps) {
  const handleDownloadCatalogue = () => {
    alert('Đang tải danh mục AXIOM Industrial Catalogue 2026 (PDF 18.5MB)...');
  };

  return (
    <section className="bg-[#0b132b] text-white overflow-hidden py-12 md:py-16 lg:py-[64px] border-b border-[#152039]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* Left column: Value Proposition & CTAs */}
        <div className="flex-1 max-w-[650px] flex flex-col items-start gap-6">
          <span className="text-[#94a3b8] text-[11px] font-semibold tracking-[1.6px] uppercase">
            ĐƯỢC XÂY DỰNG CHO NHU CẦU CỦA DÂY CHUYỀN SẢN XUẤT CỦA BẠN
          </span>

          <h1 className="text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold text-white tracking-[-1.8px] leading-[1.1] sm:leading-[1.08]">
            Nhà Cung Cấp Máy Móc Công Nghiệp & Dụng Cụ Cơ Khí Chính Xác
          </h1>

          <p className="text-[#e8edf3] text-[15px] sm:text-[16px] leading-[1.65] font-normal">
            Duy trì sản xuất liên tục. Cung cấp máy móc tin cậy, dụng cụ chính xác và phụ tùng thay thế từ một đối tác kỹ thuật duy nhất.
          </p>

          {/* Assurance badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#152039] border border-[#475569] rounded-[4px] px-3 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f59e0b] shrink-0" />
              <span className="text-[#e8edf3] text-[12px] font-medium whitespace-nowrap">
                Chứng Nhận CO/CQ
              </span>
            </div>
            <div className="bg-[#152039] border border-[#475569] rounded-[4px] px-3 py-2 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#10b981] shrink-0" />
              <span className="text-[#e8edf3] text-[12px] font-medium whitespace-nowrap">
                Hàng Có Sẵn Trong Kho
              </span>
            </div>
          </div>

          {/* Hero action buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCatalogue}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[14px] h-[50px] px-5 rounded-[4px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm w-full sm:w-auto"
            >
              <span>Tải Catalogue (PDF)</span>
              <Download className="w-4 h-4" />
            </button>

            <Link
              href="/products"
              className="border border-[#475569] hover:bg-white/10 text-white font-medium text-[14px] h-[50px] px-5 rounded-[4px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] w-full sm:w-auto"
            >
              <span>Xem Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-[#94a3b8] text-[12px]">
            Dành cho bộ phận mua hàng, xưởng cơ khí & nhà máy sản xuất.
          </p>
        </div>

        {/* Right column: Machinery showcase & technical annotation */}
        <div className="flex-1 w-full max-w-[620px] flex flex-col justify-end">
          <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden border border-[#475569] bg-[#152039] group">
            <Image
              src="/assets/images/cnc-machinery.png"
              alt="Thiết bị cơ khí và máy CNC chính xác AXIOM"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {/* Dark gradient overlay for technical focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Equipment annotation bar */}
          <div className="border-t border-[#475569] pt-4 mt-4 flex items-center justify-between text-left">
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-white tracking-wide">
                ĐƯỢC THIẾT KẾ CHO CÔNG VIỆC TIẾP THEO CỦA BẠN.
              </span>
              <span className="text-[#94a3b8] text-[11px] font-mono tracking-wider mt-0.5">
                GIA CÔNG / DỤNG CỤ / ĐO LƯỜNG
              </span>
            </div>
            <div className="w-7 h-7 rounded-[4px] border border-[#475569] flex items-center justify-center text-[#f59e0b] shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
