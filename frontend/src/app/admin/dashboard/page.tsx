'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Package,
  Clock,
  ArrowRight,
  TrendingUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { dashboardService } from '@/services';
import { AdminStats } from '@/lib/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3">
        <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
        <span className="text-[13px] text-[#475569]">Đang tải dữ liệu tổng quan...</span>
      </div>
    );
  }

  const overview = stats?.overview || {
    total_products: 54,
    in_stock_products: 48,
    total_categories: 6,
    total_quotes: 0,
    new_quotes: 0,
    contacted_quotes: 0,
    quoted_quotes: 0,
    completed_quotes: 0,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-bold text-[#0b132b]">
            Bảng Điều Khiển Tổng Quan
          </h1>
          <p className="text-[13px] text-[#475569]">
            Theo dõi tình trạng tiếp nhận yêu cầu báo giá B2B và tồn kho sản phẩm AXIOM.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#dce2ea] hover:bg-[#f8fafc] text-[#0b132b] text-[12px] font-medium px-3.5 py-2 rounded-[4px] shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới số liệu</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: New Quotes */}
        <div className="bg-white border-2 border-[#f59e0b] rounded-[8px] p-5 shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
              Yêu Cầu Báo Giá Mới
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-amber-100 flex items-center justify-center text-[#d97706]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold text-[#0b132b]">
              {overview.new_quotes}
            </span>
            <span className="text-[12px] text-amber-700 font-medium">cần xử lý</span>
          </div>
          <Link
            href="/admin/quotes?status=new"
            className="text-[12px] text-[#d97706] hover:text-[#b45309] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Xem danh sách chờ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Total Quotes */}
        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
              Tổng Lượt Báo Giá
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b132b]">
              {overview.total_quotes}
            </span>
            <span className="text-[12px] text-[#475569]">leads từ web</span>
          </div>
          <span className="text-[12px] text-[#475569]">
            {overview.quoted_quotes + overview.completed_quotes} đã gửi báo giá
          </span>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
              Tổng Sản Phẩm (SKU)
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b132b]">
              {overview.total_products}
            </span>
            <span className="text-[12px] text-emerald-700 font-medium">
              {overview.in_stock_products} có sẵn
            </span>
          </div>
          <Link
            href="/admin/products"
            className="text-[12px] text-[#0b132b] hover:text-[#f59e0b] font-medium flex items-center gap-1 transition-colors"
          >
            <span>Quản lý {overview.total_categories} danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Success rate */}
        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
              Tiến Độ Xử Lý
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#0b132b]">
              {overview.total_quotes > 0
                ? Math.round(
                    ((overview.quoted_quotes + overview.completed_quotes) /
                      overview.total_quotes) *
                      100
                  )
                : 100}
              %
            </span>
            <span className="text-[12px] text-emerald-700">tỷ lệ phản hồi</span>
          </div>
          <span className="text-[12px] text-[#475569]">Chuẩn cam kết trong 2h</span>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#dce2ea] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[16px] font-bold text-[#0b132b]">
              Yêu Cầu Báo Giá Gần Đây
            </h2>
            <p className="text-[12px] text-[#475569]">
              Các khách hàng gửi thông tin từ Landing Page Form hoặc Contact Modal
            </p>
          </div>

          <Link
            href="/admin/quotes"
            className="text-[13px] text-[#0b132b] hover:text-[#f59e0b] font-semibold flex items-center gap-1 min-h-[36px]"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_quotes && stats.recent_quotes.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#dce2ea]">
              {stats.recent_quotes.map((q) => (
                <div key={q.id} className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-[14px] text-[#0b132b] truncate">
                        {q.full_name}
                      </div>
                      {q.company_name && (
                        <div className="text-[12px] text-[#475569] truncate">
                          {q.company_name}
                        </div>
                      )}
                    </div>
                    {q.status === 'new' ? (
                      <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] shrink-0">
                        Mới nhận
                      </span>
                    ) : q.status === 'contacted' ? (
                      <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] shrink-0">
                        Đã liên hệ
                      </span>
                    ) : q.status === 'quoted' ? (
                      <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] shrink-0">
                        Đã báo giá
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px] shrink-0">
                        Hoàn tất
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                    <a
                      href={`tel:${q.phone}`}
                      className="font-mono font-semibold text-[#0b132b] underline decoration-[#dce2ea]"
                    >
                      {q.phone}
                    </a>
                    <span className="font-mono bg-[#f8fafc] border border-[#dce2ea] px-2 py-0.5 rounded-[2px] text-[11px] font-semibold text-[#0b132b]">
                      {q.sku_target || 'Tư vấn tổng quát'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                    <span>{q.source === 'landing_form' ? 'Landing Form' : 'Modal Popup'}</span>
                    <span>
                      {new Date(q.created_at).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                  <tr>
                    <th className="py-3 px-5">Khách Hàng</th>
                    <th className="py-3 px-5">Điện Thoại</th>
                    <th className="py-3 px-5">Mã SKU Cần Tìm</th>
                    <th className="py-3 px-5">Nguồn</th>
                    <th className="py-3 px-5">Trạng Thái</th>
                    <th className="py-3 px-5">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce2ea]">
                  {stats.recent_quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-5 font-semibold text-[#0b132b]">
                        <div>{q.full_name}</div>
                        {q.company_name && (
                          <div className="text-[11px] text-[#475569] font-normal">
                            {q.company_name}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-5 font-mono text-[#0b132b]">{q.phone}</td>
                      <td className="py-3 px-5">
                        <span className="font-mono bg-[#f8fafc] border border-[#dce2ea] px-2 py-0.5 rounded-[2px] text-[12px] font-semibold text-[#0b132b]">
                          {q.sku_target || 'Tư vấn tổng quát'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-[#475569] text-[12px]">
                        {q.source === 'landing_form' ? 'Landing Form' : 'Modal Popup'}
                      </td>
                      <td className="py-3 px-5">
                        {q.status === 'new' ? (
                          <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px]">
                            Mới nhận
                          </span>
                        ) : q.status === 'contacted' ? (
                          <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px]">
                            Đã liên hệ
                          </span>
                        ) : q.status === 'quoted' ? (
                          <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px]">
                            Đã báo giá
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-[2px] text-[11px]">
                            Hoàn tất
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-[#94a3b8] text-[12px]">
                        {new Date(q.created_at).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-[#475569] text-[13px]">
            Chưa có yêu cầu báo giá nào được gửi. Khách hàng gửi form từ Landing Page sẽ hiển thị ngay tại đây.
          </div>
        )}
      </div>
    </div>
  );
}
