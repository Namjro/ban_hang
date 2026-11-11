'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white border border-[#dce2ea] rounded-[8px] shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-[8px] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <span className="inline-block px-3 py-1 bg-[#152039] text-[#f59e0b] text-xs font-mono font-bold uppercase tracking-widest rounded-[4px] mb-3">
          System Fault Detected
        </span>

        <h1 className="text-2xl font-extrabold text-[#0b132b] mb-3">
          Đã xảy ra sự cố kỹ thuật
        </h1>

        <p className="text-sm text-[#475569] leading-relaxed mb-6">
          Hệ thống gặp lỗi không mong muốn trong quá trình tải dữ liệu hoặc hiển thị giao diện. Vui lòng thử tải lại trang hoặc quay về trang chủ.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 bg-[#f1f5f9] border border-[#dce2ea] rounded-[4px] text-left">
            <p className="text-xs font-mono text-[#64748b] break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-bold text-sm rounded-[4px] transition-colors shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Thử lại ngay
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0b132b] hover:bg-[#152039] text-white font-semibold text-sm rounded-[4px] transition-colors"
          >
            <Home className="h-4 w-4" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
