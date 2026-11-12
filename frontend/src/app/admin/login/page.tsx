'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '@/services';
import { authStorage } from '@/lib/auth-storage';
import { getApiErrorMessage } from '@/lib/error-handler';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@axiom.vn');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.login({ email, password });

      if (res.success && res.access_token) {
        authStorage.setToken(res.access_token);
        authStorage.setUser(res.user);
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, 'Email hoặc mật khẩu không chính xác.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b132b] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        {/* Brand identity */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] border-2 border-[#f59e0b] flex items-center justify-center bg-[#152039]">
              <svg
                className="w-5 h-5 text-[#f59e0b]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[24px] font-bold text-white tracking-[1.5px] leading-none">
                AXIOM
              </span>
              <span className="text-[8px] font-semibold tracking-[1.6px] text-[#94a3b8] uppercase">
                ADMINISTRATION CMS
              </span>
            </div>
          </Link>
          <p className="text-[#94a3b8] text-[13px] mt-1">
            Hệ thống Quản lý Báo giá & Kho Thiết bị Công nghiệp
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-[8px] p-8 shadow-2xl border border-[#dce2ea] flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-[#dce2ea] pb-4">
            <h1 className="text-[20px] font-bold text-[#0b132b]">Đăng nhập Quản trị</h1>
            <span className="text-[12px] text-[#475569]">
              Xác thực bảo mật phiên làm việc quản trị
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] p-3 rounded-[4px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b132b]">Email Quản trị</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@axiom.vn"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] pl-9.5 pr-3.5 py-2.5 text-[13px] text-[#0b132b] focus:outline-none focus:border-[#0b132b] w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0b132b]">Mật khẩu</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] pl-9.5 pr-3.5 py-2.5 text-[13px] text-[#0b132b] focus:outline-none focus:border-[#0b132b] w-full"
                />
              </div>
            </div>

            {/* Default hint */}
            <div className="bg-[#f8fafc] border border-[#dce2ea] p-2.5 rounded-[4px] text-[11px] text-[#475569] flex flex-col gap-0.5">
              <span className="font-semibold text-[#0b132b]">Tài khoản mặc định:</span>
              <span>
                Email: <code className="font-mono text-[#0b132b]">admin@axiom.vn</code>
              </span>
              <span>
                Mật khẩu: <code className="font-mono text-[#0b132b]">Password@123</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0b132b] hover:bg-[#152039] disabled:opacity-50 text-white font-medium text-[14px] h-[46px] rounded-[4px] flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#f59e0b]" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập CMS</span>
                  <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#dce2ea] flex items-center justify-between text-[11px] text-[#475569]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              Bảo mật hệ thống quản trị
            </span>
            <Link href="/" className="hover:text-[#0b132b] transition-colors underline">
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
