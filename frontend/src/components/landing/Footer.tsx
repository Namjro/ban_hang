import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b132b] text-white border-t border-[#152039] py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#152039]">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-[4px] border-2 border-[#f59e0b] flex items-center justify-center bg-transparent">
                <svg
                  className="w-4 h-4 text-[#f59e0b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] font-bold text-white tracking-[1.5px] leading-none">
                  AXIOM
                </span>
                <span className="text-[8px] font-semibold tracking-[1.6px] text-[#94a3b8] uppercase">
                  INDUSTRIAL SUPPLY
                </span>
              </div>
            </div>

            <p className="text-[#94a3b8] text-[13px] leading-relaxed max-w-[480px]">
              Đối tác kỹ thuật hàng đầu cung ứng thiết bị công nghiệp nặng, máy CNC và dụng cụ cơ khí chính xác cho các nhà máy sản xuất cơ khí, ô tô, điện tử và hàng không tại Việt Nam.
            </p>

            <div className="flex flex-col gap-1 text-[12px] text-[#94a3b8]">
              <p>📍 Kho hàng trung tâm: Lô E2, Khu Công Nghiệp Tân Bình, TP. Hồ Chí Minh</p>
              <p>📞 Hotline Kỹ Thuật: 0988.123.456 (24/7)</p>
              <p>✉️ Email Báo Giá: sales@axiom.vn</p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-[13px] font-semibold uppercase tracking-wider">
              Danh Mục Sản Phẩm
            </span>
            <ul className="flex flex-col gap-2 text-[13px] text-[#94a3b8]">
              <li><Link href="/products?category=may-cnc-va-may-cong-cu" className="hover:text-[#f59e0b] transition-colors">Máy CNC & Máy Công Cụ</Link></li>
              <li><Link href="/products?category=dung-cu-cat-got" className="hover:text-[#f59e0b] transition-colors">Dụng Cụ Cắt Gọt</Link></li>
              <li><Link href="/products?category=do-luong-chinh-xac" className="hover:text-[#f59e0b] transition-colors">Đo Lường Chính Xác</Link></li>
              <li><Link href="/products?category=ga-dat-va-phu-kien-may" className="hover:text-[#f59e0b] transition-colors">Gá Đặt & Phụ Kiện Máy</Link></li>
              <li><Link href="/products?category=bac-dan-va-truyen-dong" className="hover:text-[#f59e0b] transition-colors">Bạc Đạn & Ray Trượt</Link></li>
              <li><Link href="/products?category=boi-tron-va-khi-nen" className="hover:text-[#f59e0b] transition-colors">Bôi Trơn & Khí Nén</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal & Support */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-[13px] font-semibold uppercase tracking-wider">
              Hệ Thống & Quản Trị
            </span>
            <ul className="flex flex-col gap-2 text-[13px] text-[#94a3b8]">
              <li><Link href="/products" className="hover:text-[#f59e0b] transition-colors">Tra Cứu Mã SKU</Link></li>
              <li><a href="#quick-specs" className="hover:text-[#f59e0b] transition-colors">Bảng Thông Số Kỹ Thuật</a></li>
              <li><a href="#quote-request" className="hover:text-[#f59e0b] transition-colors">Gửi Yêu Cầu Báo Giá B2B</a></li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#152039] border border-[#475569] text-[#f59e0b] hover:border-[#f59e0b] text-[12px] font-medium transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đăng Nhập CMS Quản Trị</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#94a3b8]">
          <p>© 2026 AXIOM Industrial Supply. Tất cả các quyền được bảo lưu.</p>
          <p className="font-mono text-[11px]">Next.js 15 • Laravel 12 (PHP 8.2.35) • JWT Auth</p>
        </div>
      </div>
    </footer>
  );
}
