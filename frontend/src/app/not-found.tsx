import Link from 'next/link';
import { ShieldAlert, Home, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-[#152039] border border-slate-800 rounded-[8px] shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-[8px] flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 text-[#f59e0b]" />
        </div>

        <span className="inline-block px-3 py-1 bg-[#0b132b] border border-slate-700 text-[#f59e0b] text-xs font-mono font-bold uppercase tracking-widest rounded-[4px] mb-3">
          HTTP 404 — NOT FOUND
        </span>

        <h1 className="text-3xl font-extrabold text-white mb-3">
          Không tìm thấy trang yêu cầu
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-8">
          Đường dẫn bạn truy cập không tồn tại, đã được di chuyển hoặc mã thiết bị (SKU) không còn trong danh mục hiện hành.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-bold text-sm rounded-[4px] transition-colors shadow-sm"
          >
            <PackageSearch className="h-4 w-4" />
            Danh Mục Thiết Bị
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-[4px] border border-slate-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
