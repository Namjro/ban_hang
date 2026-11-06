'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Package,
  Layers,
  Loader2,
  Check,
  X,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Factory,
  Crosshair,
  Gauge,
  ShieldCheck,
  Zap,
  Settings,
  Box,
  Wrench,
  Cpu,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';

// Preset icon options for industrial categories
const ICON_OPTIONS = [
  { id: 'factory', label: 'Nhà máy / CNC', icon: Factory },
  { id: 'crosshair', label: 'Cắt gọt / Dao phay', icon: Crosshair },
  { id: 'gauge', label: 'Đo lường / Thước', icon: Gauge },
  { id: 'settings', label: 'Cơ khí / Gá kẹp', icon: Settings },
  { id: 'shield', label: 'Bảo hộ / Tiêu chuẩn', icon: ShieldCheck },
  { id: 'zap', label: 'Điện / Tự động hóa', icon: Zap },
  { id: 'box', label: 'Vật tư / Phụ tùng', icon: Box },
  { id: 'wrench', label: 'Bảo trì / Dụng cụ', icon: Wrench },
  { id: 'cpu', label: 'Điều khiển / PLC', icon: Cpu },
  { id: 'layers', label: 'Phôi / Vật liệu', icon: Layers },
];

function getCategoryIcon(iconId?: string | null) {
  const match = ICON_OPTIONS.find((opt) => opt.id === iconId);
  return match ? match.icon : FolderTree;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'factory',
    order: 0,
  });

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;

      const res = await api.get('/admin/categories', { params });
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách danh mục:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setErrorMessage(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      icon: 'factory',
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setErrorMessage(null);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      icon: c.icon || 'factory',
      order: c.order || 0,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from name if creating or editing slug is empty
  const handleNameChange = (newName: string) => {
    setForm((prev) => {
      const shouldUpdateSlug = !editingCategory || prev.slug === '';
      const autoSlug = newName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        ...prev,
        name: newName,
        slug: shouldUpdateSlug ? autoSlug : prev.slug,
      };
    });
  };

  // Save category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMessage('Vui lòng nhập tên danh mục.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      icon: form.icon,
      order: Number(form.order) || 0,
    };

    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      console.error(err);
      const apiErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (apiErr.response?.data?.message) {
        setErrorMessage(apiErr.response.data.message);
      } else {
        setErrorMessage('Lỗi khi lưu danh mục. Vui lòng kiểm tra slug không bị trùng lặp.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (cat: Category) => {
    if (cat.products_count && cat.products_count > 0) {
      alert(
        `Không thể xóa danh mục "${cat.name}" vì đang có ${cat.products_count} sản phẩm trực thuộc. Vui lòng chuyển hoặc xóa các sản phẩm này trước.`
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;

    try {
      await api.delete(`/admin/categories/${cat.id}`);
      fetchCategories();
    } catch (err: unknown) {
      console.error(err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      alert(apiErr.response?.data?.message || 'Lỗi khi xóa danh mục.');
    }
  };

  // Computed summary stats
  const totalProducts = categories.reduce((sum, c) => sum + (c.products_count || 0), 0);
  const highestCountCategory = [...categories].sort((a, b) => (b.products_count || 0) - (a.products_count || 0))[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#0b132b]">
              Quản Lý Danh Mục Thiết Bị
            </h1>
            <span className="bg-[#0b132b] text-[#f59e0b] text-[11px] font-bold px-2 py-0.5 rounded-[3px] font-mono">
              {categories.length} NHÓM
            </span>
          </div>
          <p className="text-[13px] text-[#475569]">
            Quản trị các nhóm sản phẩm công nghiệp cơ khí, biểu tượng nhận diện và thứ tự hiển thị trên sàn.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-semibold h-[42px] px-4 rounded-[4px] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#f59e0b]" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4.5 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              Tổng Số Danh Mục
            </span>
            <span className="text-[26px] font-bold text-[#0b132b] mt-1">
              {categories.length}
            </span>
            <span className="text-[11px] text-[#10b981] font-medium">
              Đang phân phối trên hệ thống
            </span>
          </div>
          <div className="w-12 h-12 rounded-[6px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b]">
            <FolderTree className="w-6 h-6 text-[#0b132b]" />
          </div>
        </div>

        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4.5 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              Tổng SKU Trực Thuộc
            </span>
            <span className="text-[26px] font-bold text-[#0b132b] mt-1">
              {totalProducts}
            </span>
            <span className="text-[11px] text-[#475569]">
              Toàn bộ sản phẩm được phân loại
            </span>
          </div>
          <div className="w-12 h-12 rounded-[6px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#f59e0b]">
            <Package className="w-6 h-6 text-[#f59e0b]" />
          </div>
        </div>

        <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4.5 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              Danh Mục Lớn Nhất
            </span>
            <span className="text-[16px] font-bold text-[#0b132b] mt-1 truncate" title={highestCountCategory?.name}>
              {highestCountCategory ? highestCountCategory.name : '—'}
            </span>
            <span className="text-[11px] text-[#475569]">
              {highestCountCategory ? `${highestCountCategory.products_count} sản phẩm` : 'Chưa có dữ liệu'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-[6px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-6 h-6 text-[#10b981]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-[360px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] focus-within:border-[#0b132b]">
          <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên danh mục, mã slug, mô tả..."
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <span className="text-[12px] text-[#475569]">
          Sắp xếp theo thứ tự hiển thị (Order 1 - {categories.length})
        </span>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
            <span className="text-[13px] text-[#475569]">Đang tải danh sách nhóm thiết bị...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-[#475569] text-[13px]">
            Không tìm thấy danh mục nào phù hợp với từ khóa tìm kiếm.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                <tr>
                  <th className="py-3 px-4 w-[60px] text-center">Thứ Tự</th>
                  <th className="py-3 px-4 w-[60px]">Icon</th>
                  <th className="py-3 px-5">Tên Danh Mục & Đường Dẫn Slug</th>
                  <th className="py-3 px-5">Mô Tả Kỹ Thuật</th>
                  <th className="py-3 px-4 text-center">Số Sản Phẩm</th>
                  <th className="py-3 px-4 text-center">Trang Public</th>
                  <th className="py-3 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce2ea]">
                {categories.map((c) => {
                  const IconComp = getCategoryIcon(c.icon);

                  return (
                    <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors group">
                      {/* Order */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0b132b]">
                        <span className="inline-block w-6 h-6 leading-6 bg-[#f8fafc] border border-[#dce2ea] rounded-[3px] text-[12px]">
                          {c.order ?? 0}
                        </span>
                      </td>

                      {/* Icon */}
                      <td className="py-3.5 px-4">
                        <div className="w-9 h-9 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#0b132b] text-[14px]">
                          {c.name}
                        </div>
                        <div className="font-mono text-[11px] text-[#94a3b8] mt-0.5">
                          slug: <span className="text-[#0b132b] font-medium">{c.slug}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-5 text-[#475569] max-w-[320px]">
                        <p className="line-clamp-2 text-[12px] leading-relaxed">
                          {c.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                        </p>
                      </td>

                      {/* Product Count with Quick Filter Link */}
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/admin/products?category_id=${c.id}`}
                          className="inline-flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#dce2ea] text-[#0b132b] font-semibold text-[11px] px-2.5 py-1 rounded-[3px] border border-[#dce2ea] transition-colors"
                          title="Lọc sản phẩm thuộc danh mục này trong CMS"
                        >
                          <Package className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span>{c.products_count ?? 0} SKU</span>
                        </Link>
                      </td>

                      {/* Public Page Link */}
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={`/products?category=${c.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#475569] hover:text-[#0b132b] font-medium hover:underline"
                          title="Mở xem trang danh mục ngoài web"
                        >
                          <span>Xem ngoài web</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors cursor-pointer"
                            title="Chỉnh sửa danh mục"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
          <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[580px] p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#0b132b] text-white flex items-center justify-center">
                  <FolderTree className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0b132b]">
                    {editingCategory ? 'Chỉnh Sửa Nhóm Danh Mục' : 'Thêm Danh Mục Thiết Bị Mới'}
                  </h3>
                  <p className="text-[12px] text-[#475569]">
                    Định hình cấu trúc nhóm vật tư, icon đại diện và đường dẫn SEO
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-[4px] hover:bg-[#f8fafc] text-[#475569] transition-colors cursor-pointer"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] flex items-center gap-2 text-red-700 text-[12px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#0b132b]">Tên Danh Mục *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Thiết Bị Thủy Lực & Khí Nén"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-semibold focus:outline-none focus:border-[#0b132b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Đường Dẫn Slug (SEO / URL) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="thiet-bi-thuy-luc"
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono focus:outline-none focus:border-[#0b132b]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Thứ Tự Hiển Thị (Order)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    placeholder="1, 2, 3..."
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono focus:outline-none focus:border-[#0b132b]"
                  />
                </div>
              </div>

              {/* Icon selector */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-[12px] font-semibold text-[#0b132b]">
                  Biểu Tượng Nhận Diện (Icon)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = form.icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm({ ...form, icon: opt.id })}
                        className={`flex flex-col items-center justify-center p-2 rounded-[4px] border transition-all text-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0b132b] text-[#f59e0b] border-[#0b132b] ring-1 ring-[#0b132b]'
                            : 'bg-[#f8fafc] text-[#475569] border-[#dce2ea] hover:border-[#0b132b]'
                        }`}
                      >
                        <OptIcon className="w-4 h-4" />
                        <span className="text-[10px] font-medium truncate w-full">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#0b132b]">Mô Tả Danh Mục</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả phạm vi ứng dụng, nhóm thiết bị trực thuộc..."
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b] resize-none"
                />
              </div>

              {/* Live Preview Card */}
              <div className="border border-[#dce2ea] rounded-[6px] p-3 bg-[#f8fafc] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center">
                    {React.createElement(getCategoryIcon(form.icon), { className: 'w-5 h-5' })}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#0b132b]">
                      {form.name || 'Tên danh mục xem trước'}
                    </span>
                    <span className="text-[11px] text-[#475569] font-mono">
                      /products?category={form.slug || 'slug'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-white border border-[#dce2ea] px-2 py-0.5 rounded font-mono text-[#475569]">
                  Preview
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dce2ea]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px] font-medium cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
