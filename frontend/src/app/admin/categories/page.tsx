'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Layers,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { categoryService } from '@/services';
import { Category, CategoryPayload } from '@/lib/types';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useDebounce } from '@/hooks/useDebounce';
import CategoryFormModal, { getCategoryIcon } from '@/components/admin/CategoryFormModal';
import { useToast } from '@/components/ui/Toast';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAdminCategories(debouncedSearch || undefined);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách danh mục:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (payload: CategoryPayload) => {
    if (!payload.name) {
      setErrorMessage('Vui lòng nhập tên danh mục.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setErrorMessage(
        getApiErrorMessage(err, 'Lỗi khi lưu danh mục. Vui lòng kiểm tra slug không bị trùng lặp.')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (cat.products_count && cat.products_count > 0) {
      toast.warning(
        `Không thể xóa danh mục "${cat.name}" vì đang có ${cat.products_count} sản phẩm trực thuộc. Vui lòng chuyển hoặc xóa các sản phẩm này trước.`
      );
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;

    try {
      await categoryService.deleteCategory(cat.id);
      toast.success(`Đã xóa danh mục "${cat.name}".`);
      fetchCategories();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Lỗi khi xóa danh mục.'));
    }
  };

  const totalProducts = categories.reduce((sum, c) => sum + (c.products_count || 0), 0);
  const highestCountCategory = [...categories].sort(
    (a, b) => (b.products_count || 0) - (a.products_count || 0)
  )[0];

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
            <span
              className="text-[16px] font-bold text-[#0b132b] mt-1 truncate"
              title={highestCountCategory?.name}
            >
              {highestCountCategory ? highestCountCategory.name : '—'}
            </span>
            <span className="text-[11px] text-[#475569]">
              {highestCountCategory
                ? `${highestCountCategory.products_count} sản phẩm`
                : 'Chưa có dữ liệu'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-[6px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-6 h-6 text-[#10b981]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-[360px] min-h-[44px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[16px] sm:text-[13px] focus-within:border-[#0b132b]">
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

      {/* Categories List / Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
            <span className="text-[13px] text-[#475569]">
              Đang tải danh sách nhóm thiết bị...
            </span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-[#475569] text-[13px]">
            Không tìm thấy danh mục nào phù hợp với từ khóa tìm kiếm.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#dce2ea]">
              {categories.map((c) => {
                const IconComp = getCategoryIcon(c.icon);

                return (
                  <div key={c.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[15px] text-[#0b132b] truncate">
                            {c.name}
                          </span>
                          <span className="inline-block px-2 py-0.5 bg-[#f8fafc] border border-[#dce2ea] rounded-[3px] font-mono text-[11px] font-bold text-[#0b132b] shrink-0">
                            #{c.order ?? 0}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-[#94a3b8] truncate mt-0.5">
                          /{c.slug}
                        </div>
                      </div>
                    </div>

                    <p className="text-[12px] text-[#475569] line-clamp-2 leading-relaxed">
                      {c.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/admin/products?category_id=${c.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#dce2ea] text-[#0b132b] font-semibold text-[12px] px-2.5 py-1.5 rounded-[3px] border border-[#dce2ea]"
                      >
                        <Package className="w-3.5 h-3.5 text-[#f59e0b]" />
                        <span>{c.products_count ?? 0} SKU</span>
                      </Link>

                      <a
                        href={`/products?category=${c.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] text-[#475569] hover:text-[#0b132b] font-medium"
                      >
                        <span>Xem ngoài web</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="flex-1 min-h-[40px] px-3 bg-[#f8fafc] border border-[#dce2ea] hover:bg-[#dce2ea] text-[#0b132b] rounded-[4px] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c)}
                        className="min-w-[44px] min-h-[40px] px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-[4px] inline-flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Xóa danh mục ${c.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0b132b]">
                        <span className="inline-block w-6 h-6 leading-6 bg-[#f8fafc] border border-[#dce2ea] rounded-[3px] text-[12px]">
                          {c.order ?? 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-9 h-9 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#0b132b] text-[14px]">{c.name}</div>
                        <div className="font-mono text-[11px] text-[#94a3b8] mt-0.5">
                          slug: <span className="text-[#0b132b] font-medium">{c.slug}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-[#475569] max-w-[320px]">
                        <p className="line-clamp-2 text-[12px] leading-relaxed">
                          {c.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                        </p>
                      </td>

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
          </>
        )}
      </div>

      {/* Modal Create / Edit Category */}
      <CategoryFormModal
        isOpen={isModalOpen}
        editingCategory={editingCategory}
        defaultOrder={categories.length + 1}
        saving={saving}
        errorMessage={errorMessage}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
