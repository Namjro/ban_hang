'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Check,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { categoryService, productService } from '@/services';
import { Product, Category, ProductPayload } from '@/lib/types';
import { SAMPLE_PRODUCT_IMAGES } from '@/constants';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useDebounce } from '@/hooks/useDebounce';
import ProductFormModal from '@/components/admin/ProductFormModal';
import { useToast } from '@/components/ui/Toast';
import SelectField from '@/components/ui/SelectField';

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [placementFilter, setPlacementFilter] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Read initial category_id from query string and load categories
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catId = urlParams.get('category_id');
      if (catId) {
        setCategoryFilter(catId);
      }
    }

    categoryService
      .getPublicCategories()
      .then((res) => {
        if (res.success) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await productService.getAdminProducts({
          page,
          per_page: 12,
          search: debouncedSearch || undefined,
          category_id: categoryFilter || undefined,
          stock_status: stockFilter || undefined,
          show_on_home: placementFilter === 'home_section_01' ? true : undefined,
          show_in_quick_specs: placementFilter === 'home_section_02' ? true : undefined,
          has_datasheet: placementFilter === 'has_datasheet' ? true : undefined,
        });

        if (res.success) {
          setProducts(res.data);
          setPagination({
            total: res.pagination.total,
            current_page: res.pagination.current_page,
            last_page: res.pagination.last_page,
          });
        }
      } catch (err) {
        console.error('Failed to load admin products', err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, categoryFilter, stockFilter, placementFilter]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (payload: ProductPayload) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success('Đã cập nhật thông tin sản phẩm.');
      } else {
        await productService.createProduct(payload);
        toast.success('Đã thêm sản phẩm mới vào kho.');
      }
      setIsModalOpen(false);
      fetchProducts(pagination.current_page);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Lỗi lưu sản phẩm. Vui lòng kiểm tra mã SKU không trùng lặp.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Đã xóa sản phẩm.');
      fetchProducts(pagination.current_page);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Không thể xóa sản phẩm.'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#0b132b]">
              Quản Lý Sản Phẩm (Kho SKU)
            </h1>
            <span className="bg-[#0b132b] text-white text-[11px] font-bold px-2 py-0.5 rounded-[3px]">
              CMS v2.0
            </span>
          </div>
          <p className="text-[13px] text-[#475569]">
            Quản trị đa ảnh sản phẩm, thông số kỹ thuật đa chiều, chứng chỉ CO/CQ và liên kết trực tiếp trang chi tiết.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-semibold h-[42px] px-4 rounded-[4px] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#f59e0b]" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-[320px] min-h-[44px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[16px] sm:text-[13px] focus-within:border-[#0b132b]">
          <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo SKU, tên thiết bị, hãng..."
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0">
          <SelectField
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Lọc theo danh mục"
            wrapperClassName="sm:w-[210px]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Lọc theo tình trạng tồn kho"
            wrapperClassName="sm:w-[180px]"
          >
            <option value="">Tất cả tồn kho</option>
            <option value="in_stock">Hàng có sẵn</option>
            <option value="low_stock">Sắp hết hàng</option>
            <option value="pre_order">Đặt trước</option>
          </SelectField>

          <SelectField
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            aria-label="Lọc theo vị trí hiển thị trang chủ"
            wrapperClassName="sm:w-[220px]"
          >
            <option value="">Tất cả vị trí trang chủ</option>
            <option value="home_section_01">Mục 01: SP Tiêu Biểu</option>
            <option value="home_section_02">Mục 02: Bảng Tài Liệu</option>
            <option value="has_datasheet">Đã có Tài Liệu PDF</option>
          </SelectField>
        </div>
      </div>

      {/* Products List / Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
            <span className="text-[13px] text-[#475569]">Đang tải danh sách SKU...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-[#475569] text-[13px]">
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#dce2ea]">
              {products.map((p) => {
                const thumbnail =
                  (Array.isArray(p.images) && p.images[0]) ||
                  p.image_url ||
                  SAMPLE_PRODUCT_IMAGES[0];
                const imgCount = Array.isArray(p.images)
                  ? p.images.length
                  : p.image_url
                    ? 1
                    : 0;

                return (
                  <div key={p.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 rounded-[4px] bg-[#f1f5f9] border border-[#dce2ea] overflow-hidden flex items-center justify-center shrink-0">
                        <Image
                          src={thumbnail}
                          alt={p.name}
                          fill
                          unoptimized={thumbnail.startsWith('data:') || thumbnail.startsWith('http')}
                          className="object-contain p-1"
                        />
                        {imgCount > 1 && (
                          <span className="absolute bottom-0 right-0 bg-[#0b132b]/90 text-white text-[9px] font-mono px-1 rounded-tl-[3px] leading-tight font-bold">
                            {imgCount}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[12px] font-bold text-[#0b132b]">
                            {p.sku}
                          </span>
                          {p.stock_status === 'in_stock' ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3" /> Có sẵn
                            </span>
                          ) : p.stock_status === 'low_stock' ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] shrink-0">
                              Sắp hết
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] shrink-0">
                              Đặt hàng
                            </span>
                          )}
                        </div>

                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[14px] text-[#0b132b] hover:text-[#d97706] line-clamp-2 mt-1 block"
                        >
                          {p.name}
                        </a>

                        <div className="text-[12px] text-[#475569] mt-0.5">
                          {p.category?.name || 'Vật tư'} • <strong className="text-[#0b132b]">{p.brand}</strong>
                        </div>
                      </div>
                    </div>

                    {(p.is_featured || p.show_on_home || p.show_in_quick_specs || p.datasheet_url || p.has_cocq) && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.has_cocq && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> CO/CQ
                          </span>
                        )}
                        {p.show_on_home && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] font-mono">
                            Mục 01 #{p.home_order ?? 0}
                          </span>
                        )}
                        {p.show_in_quick_specs && (
                          <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] font-mono">
                            Mục 02 #{p.quick_spec_order ?? 0}
                          </span>
                        )}
                        {p.datasheet_url && (
                          <a
                            href={p.datasheet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] inline-flex items-center gap-1"
                            title="Xem tài liệu PDF"
                          >
                            <FileText className="w-3 h-3 text-emerald-700" />
                            <span>PDF</span>
                          </a>
                        )}
                        {p.is_featured && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`/products/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-[44px] min-h-[40px] px-3 border border-[#dce2ea] text-[#475569] hover:text-[#0b132b] rounded-[4px] inline-flex items-center justify-center gap-1.5 text-[12px] font-medium"
                        title="Xem trang chi tiết ngoài web"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Xem</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="flex-1 min-h-[40px] px-3 bg-[#f8fafc] border border-[#dce2ea] hover:bg-[#dce2ea] text-[#0b132b] rounded-[4px] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="min-w-[44px] min-h-[40px] px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-[4px] inline-flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Xóa ${p.name}`}
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
                  <th className="py-3 px-4 w-[80px]">Hình ảnh</th>
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-5">Tên Sản Phẩm (Bấm để xem)</th>
                  <th className="py-3 px-4">Danh Mục</th>
                  <th className="py-3 px-4">Thương Hiệu</th>
                  <th className="py-3 px-4">Tồn Kho</th>
                  <th className="py-3 px-4">Chứng Chỉ</th>
                  <th className="py-3 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce2ea]">
                {products.map((p) => {
                  const thumbnail =
                    (Array.isArray(p.images) && p.images[0]) ||
                    p.image_url ||
                    SAMPLE_PRODUCT_IMAGES[0];
                  const imgCount = Array.isArray(p.images)
                    ? p.images.length
                    : p.image_url
                      ? 1
                      : 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-[4px] bg-[#f1f5f9] border border-[#dce2ea] overflow-hidden flex items-center justify-center shrink-0">
                          <Image
                            src={thumbnail}
                            alt={p.name}
                            fill
                            unoptimized={thumbnail.startsWith('data:') || thumbnail.startsWith('http')}
                            className="object-contain p-1"
                          />
                          {imgCount > 1 && (
                            <span className="absolute bottom-0 right-0 bg-[#0b132b]/90 text-white text-[9px] font-mono px-1 rounded-tl-[3px] leading-tight font-bold">
                              {imgCount}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#0b132b] whitespace-nowrap">
                        {p.sku}
                      </td>

                      <td className="py-3.5 px-5">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#0b132b] hover:text-[#d97706] transition-colors flex items-center gap-1.5 max-w-[320px] line-clamp-1 group/link"
                          title="Mở trang chi tiết sản phẩm ở tab mới"
                        >
                          <span>{p.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover/link:text-[#d97706] shrink-0" />
                        </a>
                        {p.specifications && (
                          <div className="text-[11px] text-[#94a3b8] max-w-[320px] truncate mt-0.5">
                            {Object.entries(p.specifications)
                              .slice(0, 3)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </div>
                        )}
                        {(p.is_featured || p.show_on_home || p.show_in_quick_specs || p.datasheet_url) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.show_on_home && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] font-mono">
                                Mục 01 #{p.home_order ?? 0}
                              </span>
                            )}
                            {p.show_in_quick_specs && (
                              <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] font-mono">
                                Mục 02 #{p.quick_spec_order ?? 0}
                              </span>
                            )}
                            {p.datasheet_url && (
                              <a
                                href={p.datasheet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] inline-flex items-center gap-1"
                                title="Xem tài liệu PDF"
                              >
                                <FileText className="w-3 h-3 text-emerald-700" />
                                <span>PDF</span>
                              </a>
                            )}
                            {p.is_featured && (
                              <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                                Nổi bật
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                        {p.category?.name || 'Vật tư'}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#0b132b] whitespace-nowrap">
                        {p.brand}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {p.stock_status === 'in_stock' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Có sẵn
                          </span>
                        ) : p.stock_status === 'low_stock' ? (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                            Đặt hàng
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {Array.isArray(p.certificates) && p.certificates.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            <span className="bg-blue-50 text-[#0b132b] border border-blue-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                              {p.certificates[0].split(' ')[0]}
                            </span>
                            {p.certificates.length > 1 && (
                              <span className="bg-[#f8fafc] text-[#475569] border border-[#dce2ea] text-[10px] px-1 py-0.5 rounded-[2px]">
                                +{p.certificates.length - 1}
                              </span>
                            )}
                          </div>
                        ) : p.has_cocq ? (
                          <span className="text-[#10b981] font-semibold text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> CO/CQ
                          </span>
                        ) : (
                          <span className="text-[#94a3b8] text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#475569] hover:text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors"
                            title="Xem trang chi tiết ngoài web (tab mới)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin sản phẩm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                            title="Xóa sản phẩm"
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

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-[#dce2ea] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#475569]">
            <span>Tổng số {pagination.total} sản phẩm</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {Array.from({ length: pagination.last_page }).map((_, idx) => {
                const pg = idx + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => fetchProducts(pg)}
                    className={`w-8 h-8 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer ${
                      pagination.current_page === pg
                        ? 'bg-[#0b132b] text-white font-bold'
                        : 'bg-[#f8fafc] border border-[#dce2ea] hover:bg-[#dce2ea] text-[#0b132b]'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        categories={categories}
        saving={saving}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
