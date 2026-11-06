'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Check,
  ArrowUpRight,
  Loader2,
  PackageOpen,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [pagination, setPagination] = useState({
    total: 54,
    current_page: 1,
    last_page: 1,
  });

  // Modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetSku, setQuoteTargetSku] = useState<string>('');

  // Sample static images mapping for fallback
  const sampleImages = [
    '/assets/images/products/sample-1.png',
    '/assets/images/products/sample-2.png',
    '/assets/images/products/sample-3.png',
    '/assets/images/products/sample-4.png',
    '/assets/images/products/sample-5.png',
    '/assets/images/products/sample-6.png',
    '/assets/images/products/sample-7.png',
    '/assets/images/products/sample-8.png',
    '/assets/images/products/sample-9.png',
  ];

  // Fetch Categories
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 12 };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStock) params.stock_status = selectedStock;
      if (selectedBrand) params.brand = selectedBrand;

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination({
          total: res.data.pagination.total,
          current_page: res.data.pagination.current_page,
          last_page: res.data.pagination.last_page,
        });
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedStock, selectedBrand]);

  useEffect(() => {
    startTransition(() => {
      fetchProducts(1);
    });
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedStock('');
    setSelectedBrand('');
  };

  const handleRequestQuote = (sku: string) => {
    setQuoteTargetSku(sku);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
      <Navbar onOpenQuoteModal={() => { setQuoteTargetSku(''); setIsQuoteModalOpen(true); }} />

      <main className="flex-1 pb-16">
        {/* Breadcrumb & Catalog Introduction (Figma 9:1060) */}
        <div className="bg-white border-b border-[#dce2ea] py-6 sm:py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col gap-5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] text-[#475569]">
              <Link href="/" className="hover:text-[#0b132b] transition-colors">Trang chủ</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="font-semibold text-[#0b132b]">Tất cả sản phẩm</span>
            </nav>

            {/* Title & Scope */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2 max-w-[850px]">
                <span className="text-[#475569] text-[11px] font-semibold tracking-[1.6px] uppercase">
                  THIẾT BỊ / DỤNG CỤ / PHỤ TÙNG
                </span>
                <h1 className="text-[32px] sm:text-[40px] font-bold text-[#0b132b] tracking-[-1.5px] leading-tight">
                  Tất cả sản phẩm
                </h1>
                <p className="text-[#475569] text-[14px] leading-relaxed">
                  Tìm đúng thiết bị theo mã SKU, hãng và yêu cầu kỹ thuật cho dây chuyền của bạn.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end shrink-0">
                <span className="text-[24px] font-bold text-[#0b132b]">
                  {pagination.total} sản phẩm
                </span>
                <span className="text-[12px] text-[#475569]">
                  6 nhóm sản phẩm · Tiêu chuẩn CO/CQ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar (Figma 9:1074) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] pt-8 pb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); fetchProducts(1); }}
            className="bg-white border border-[#dce2ea] rounded-[4px] h-[52px] flex items-center px-4 gap-3 shadow-xs focus-within:border-[#0b132b] focus-within:ring-1 focus-within:ring-[#0b132b] transition-all"
          >
            <Search className="w-5 h-5 text-[#475569] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã SKU hoặc thông số kỹ thuật (vd: AX-PM-150, Vertex, BT40, 55 HRC)..."
              className="bg-transparent text-[14px] text-[#0b132b] placeholder-[#94a3b8] w-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-medium h-[38px] px-4 rounded-[4px] shrink-0 transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Filter and Results Grid (Figma 9:1079) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar (Figma 9:1080) */}
            <aside className="w-full lg:w-[280px] bg-white border border-[#dce2ea] rounded-[8px] p-5 shrink-0 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
                <div className="flex items-center gap-2 text-[#0b132b] font-bold text-[14px]">
                  <SlidersHorizontal className="w-4 h-4 text-[#0b132b]" />
                  <span>Bộ lọc sản phẩm</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[12px] text-[#475569] hover:text-[#0b132b] flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>

              {/* Category Filter */}
              <div className="py-4 border-b border-[#dce2ea] flex flex-col gap-3">
                <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
                  Nhóm Sản Phẩm
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-left text-[13px] py-1 px-2 rounded-[4px] flex items-center justify-between transition-colors ${
                      selectedCategory === '' ? 'bg-[#0b132b] text-white font-semibold' : 'text-[#475569] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <span>Tất cả danh mục</span>
                    <span className="text-[11px] opacity-75">{pagination.total}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left text-[13px] py-1 px-2 rounded-[4px] flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug ? 'bg-[#0b132b] text-white font-semibold' : 'text-[#475569] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[11px] opacity-75">{cat.products_count ?? 9}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="py-4 border-b border-[#dce2ea] flex flex-col gap-3">
                <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
                  Tình Trạng Kho
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { val: '', label: 'Tất cả' },
                    { val: 'in_stock', label: 'Hàng có sẵn' },
                    { val: 'low_stock', label: 'Sắp hết hàng' },
                    { val: 'pre_order', label: 'Đặt hàng theo lịch' },
                  ].map((st) => (
                    <label key={st.val} className="flex items-center gap-2.5 text-[13px] text-[#475569] cursor-pointer hover:text-[#0b132b]">
                      <input
                        type="radio"
                        name="stock_filter"
                        checked={selectedStock === st.val}
                        onChange={() => setSelectedStock(st.val)}
                        className="accent-[#0b132b]"
                      />
                      <span>{st.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-4 flex flex-col gap-3">
                <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
                  Thương Hiệu
                </span>
                <div className="flex flex-col gap-2">
                  {['', 'Axiom', 'Mitutoyo', 'Vertex', 'SKF', 'Sandvik Coromant', 'SMC Pneumatics'].map((b) => (
                    <label key={b} className="flex items-center gap-2.5 text-[13px] text-[#475569] cursor-pointer hover:text-[#0b132b]">
                      <input
                        type="radio"
                        name="brand_filter"
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                        className="accent-[#0b132b]"
                      />
                      <span>{b || 'Tất cả thương hiệu'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {loading ? (
                <div className="bg-white border border-[#dce2ea] rounded-[8px] p-16 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
                  <span className="text-[14px] text-[#475569]">Đang tải danh mục thiết bị AXIOM...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white border border-[#dce2ea] rounded-[8px] p-16 text-center flex flex-col items-center justify-center gap-4">
                  <PackageOpen className="w-12 h-12 text-[#94a3b8]" />
                  <h3 className="text-[18px] font-bold text-[#0b132b]">
                    Không tìm thấy sản phẩm phù hợp
                  </h3>
                  <p className="text-[13px] text-[#475569] max-w-[420px]">
                    Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Đặt lại&quot; bộ lọc để xem toàn bộ danh mục sản phẩm của AXIOM.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[13px] h-[40px] px-5 rounded-[4px] transition-colors"
                  >
                    Xem lại toàn bộ 54 sản phẩm
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((prod, index) => {
                      const fallbackImg = sampleImages[index % sampleImages.length];
                      const primaryImg = (Array.isArray(prod.images) && prod.images[0]) || prod.image_url || fallbackImg;
                      const imageCount = Array.isArray(prod.images) ? prod.images.length : (prod.image_url ? 1 : 0);

                      return (
                        <div
                          key={prod.id}
                          className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-[#0b132b] transition-all duration-200 group shadow-2xs hover:shadow-md"
                        >
                          <div>
                            {/* Product Image Area - Click opens detail in new tab */}
                            <a
                              href={`/products/${prod.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#f8fafc] h-[190px] relative overflow-hidden flex items-center justify-center p-3 border-b border-[#dce2ea] block cursor-pointer"
                              title="Bấm để mở chi tiết sản phẩm ở tab mới"
                            >
                              <Image
                                src={primaryImg}
                                alt={prod.name}
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Badges on image */}
                              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                                <span className="bg-[#0b132b] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] tracking-wide">
                                  {prod.sku}
                                </span>
                                {imageCount > 1 && (
                                  <span className="bg-[#152039]/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-[2px]">
                                    {imageCount} ảnh
                                  </span>
                                )}
                              </div>

                              <div className="absolute top-2.5 right-2.5 z-10">
                                {prod.stock_status === 'in_stock' ? (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Có sẵn
                                  </span>
                                ) : prod.stock_status === 'low_stock' ? (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                                    Sắp hết
                                  </span>
                                ) : (
                                  <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                                    Đặt hàng
                                  </span>
                                )}
                              </div>
                            </a>

                            {/* Details */}
                            <div className="p-4 flex flex-col gap-2.5">
                              <div className="flex items-center justify-between text-[11px] text-[#475569]">
                                <span>{prod.category?.name || 'Vật Tư Công Nghiệp'}</span>
                                <span className="font-semibold text-[#0b132b]">{prod.brand}</span>
                              </div>

                              <a
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[14px] font-bold text-[#0b132b] leading-snug line-clamp-2 min-h-[40px] group-hover:text-[#d97706] transition-colors block"
                                title="Bấm để mở chi tiết sản phẩm ở tab mới"
                              >
                                {prod.name}
                              </a>

                              {/* Specs Snapshot */}
                              {prod.specifications && (
                                <div className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 flex flex-col gap-1 text-[11px] text-[#475569]">
                                  {Object.entries(prod.specifications).slice(0, 2).map(([key, val], sIdx) => (
                                    <div key={sIdx} className="flex items-center justify-between">
                                      <span className="text-[#94a3b8] truncate pr-2">{key}:</span>
                                      <span className="font-medium text-[#0b132b] truncate">{val}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer card action */}
                          <div className="p-4 pt-0">
                            <div className="flex items-center justify-between pt-2 border-t border-[#dce2ea] gap-2">
                              <a
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[#475569] hover:text-[#0b132b] text-[11px] font-medium transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                                <span>Chi tiết</span>
                                <ArrowUpRight className="w-3 h-3 text-[#94a3b8]" />
                              </a>

                              <button
                                onClick={() => handleRequestQuote(prod.sku)}
                                className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[12px] h-[34px] px-3 rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shrink-0"
                              >
                                <span>Báo Giá</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                      {Array.from({ length: pagination.last_page }).map((_, pIdx) => {
                        const pageNum = pIdx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchProducts(pageNum)}
                            className={`w-9 h-9 rounded-[4px] text-[13px] font-medium transition-colors ${
                              pagination.current_page === pageNum
                                ? 'bg-[#0b132b] text-white font-bold'
                                : 'bg-white border border-[#dce2ea] text-[#0b132b] hover:bg-[#f8fafc]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Sourcing Assistance Banner (Figma 9:1384) */}
              <div className="bg-[#0b132b] text-white rounded-[8px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
                <div className="flex flex-col gap-1.5 max-w-[620px]">
                  <span className="text-[#f59e0b] text-[11px] font-semibold uppercase tracking-wider">
                    HỖ TRỢ TÌM NGUỒN ĐẶC THÙ
                  </span>
                  <h4 className="text-[20px] font-bold text-white tracking-[-0.5px]">
                    Không tìm thấy thông số cần tìm?
                  </h4>
                  <p className="text-[#e8edf3] text-[13px] leading-relaxed">
                    Đội ngũ kỹ sư AXIOM hỗ trợ tìm nguồn thiết bị theo mã model hiếm, phôi cơ khí đặc chủng và tiêu chuẩn xuất xưởng quốc tế.
                  </p>
                </div>

                <button
                  onClick={() => { setQuoteTargetSku('TÌM NGUỒN THEO BẢN VẼ'); setIsQuoteModalOpen(true); }}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-semibold text-[13px] h-[46px] px-6 rounded-[4px] flex items-center justify-center gap-2 shrink-0 transition-colors whitespace-nowrap"
                >
                  <span>Gửi Yêu Cầu Tìm Nguồn</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <FloatingContactBubble onClick={() => { setQuoteTargetSku(''); setIsQuoteModalOpen(true); }} />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialSku={quoteTargetSku}
      />
    </div>
  );
}
