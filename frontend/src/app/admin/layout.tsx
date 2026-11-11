'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Package,
  ExternalLink,
  LogOut,
  User,
  ShieldCheck,
  FolderTree,
} from 'lucide-react';
import { authService } from '@/services';
import { authStorage } from '@/lib/auth-storage';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Administrator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = authStorage.getToken();
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      router.push('/admin/login');
    } else if (token) {
      const user = authStorage.getUser();
      if (user?.name) {
        setUserName(user.name);
      }
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network/token expiration errors on logout
    }
    authStorage.clear();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted) {
    return null;
  }

  const navItems = [
    { label: 'Tổng Quan', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Yêu Cầu Báo Giá', href: '/admin/quotes', icon: FileText },
    { label: 'Quản Lý Danh Mục', href: '/admin/categories', icon: FolderTree },
    { label: 'Quản Lý Sản Phẩm', href: '/admin/products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0b132b] text-white flex flex-col justify-between shrink-0 border-r border-[#152039] fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Brand */}
          <div className="h-[72px] px-6 border-b border-[#152039] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] border-2 border-[#f59e0b] flex items-center justify-center bg-[#152039]">
                <svg
                  className="w-4 h-4 text-[#f59e0b]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-bold tracking-wider leading-none">
                  AXIOM
                </span>
                <span className="text-[8px] font-semibold tracking-widest text-[#94a3b8] uppercase">
                  CMS QUẢN TRỊ
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase mb-1">
              Phân Hệ Quản Lý
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#152039] text-[#f59e0b] border-l-2 border-[#f59e0b]'
                      : 'text-[#e8edf3] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#152039]">
              <span className="px-3 text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase mb-1">
                Lối Tắt
              </span>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[13px] font-medium text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Xem Trang Public</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer Profile */}
        <div className="p-4 border-t border-[#152039] flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#152039] border border-[#475569] flex items-center justify-center text-[#f59e0b]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-white truncate">
                {userName}
              </span>
              <span className="text-[10px] text-[#10b981] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                JWT Session
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[4px] bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/60 text-[12px] font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-[#dce2ea] px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-[13px] text-[#475569]">
            <span>CMS</span>
            <span>/</span>
            <span className="font-semibold text-[#0b132b]">
              {pathname === '/admin/dashboard'
                ? 'Tổng Quan'
                : pathname === '/admin/quotes'
                  ? 'Yêu Cầu Báo Giá'
                  : pathname === '/admin/categories'
                    ? 'Quản Lý Danh Mục'
                    : 'Quản Lý Sản Phẩm'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] bg-[#f8fafc] border border-[#dce2ea] px-2.5 py-1 rounded-[4px] text-[#475569]">
              Laravel 12 API • PHP 8.2.35
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
