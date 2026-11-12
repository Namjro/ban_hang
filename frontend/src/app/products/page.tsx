'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  ChevronRight,
  Loader2,
  PackageOpen,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import ProductCard from '@/components/products/ProductCard';
import CatalogFilterSidebar from '@/components/products/CatalogFilterSidebar';
import { categoryService, productService } from '@/services';
import { Product, Category } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || '';
  const initialSearchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Filters
  const [search, setSearch] = useState(initialSearchParam);
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
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

  // Sync URL query params if user navigates via Navbar or Category links
  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('search');
    if (catParam !== null) {
      setSelectedCategory(catParam);
    }
    if (qParam !== null) {
      setSearch(qParam);
    }
  }, [searchParams]);

  // Fetch Categories & Brands
  useEffect(() => {
    categoryService
      .getPublicCategories()
      .then((res) => {
        if (res.success) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));

    productService
      .getBrands()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setBrands(res.data);
        }
      })
      .catch((err) => console.error('Failed to load brands', err));
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await productService.getPublicProducts({
          page,
          per_page: 12,
          search: debouncedSearch || undefined,
          category: selectedCategory || undefined,
          stock_status: selectedStock || undefined,
          brand: selectedBrand || undefined,
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
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, selectedStock, selectedBrand]
  );

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
      <Navbar
        onOpenQuoteModal={() => {
          setQuoteTargetSku('');
          setIsQuoteModalOpen(true);
        }}
      />

      <main className="flex-1 pb-16">
        {/* Breadcrumb & Catalog Introduction */}
        <div className="bg-white border-b border-[#dce2ea] py-6 sm:py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col gap-5">
            <nav className="flex items-center gap-2 text-[12px] text-[#475569]">
              <Link href="/" className="hover:text-[#0b132b] transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="font-semibold text-[#0b132b]">Tất cả sản phẩm</span>
            </nav>

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

        {/* Search Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] pt-8 pb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchProducts(1);
            }}
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
              className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-medium h-[38px] px-4 rounded-[4px] shrink-0 transition-colors cursor-pointer"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Filter and Results Grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CatalogFilterSidebar
              categories={categories}
              brands={brands}
              totalProducts={pagination.total}
              selectedCategory={selectedCategory}
              selectedStock={selectedStock}
              selectedBrand={selectedBrand}
              onSelectCategory={setSelectedCategory}
              onSelectStock={setSelectedStock}
              onSelectBrand={setSelectedBrand}
              onResetFilters={handleResetFilters}
            />

            {/* Products Grid */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {loading ? (
                <div className="bg-white border border-[#dce2ea] rounded-[8px] p-16 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
                  <span className="text-[14px] text-[#475569]">
                    Đang tải danh mục thiết bị AXIOM...
                  </span>
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
                    className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-medium text-[13px] h-[40px] px-5 rounded-[4px] transition-colors cursor-pointer"
                  >
                    Xem lại toàn bộ 54 sản phẩm
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((prod, index) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        index={index}
                        onRequestQuote={handleRequestQuote}
                      />
                    ))}
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
                            className={`w-9 h-9 rounded-[4px] text-[13px] font-medium transition-colors cursor-pointer ${
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

              {/* Sourcing Assistance Banner */}
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
                  onClick={() => {
                    setQuoteTargetSku('TÌM NGUỒN THEO BẢN VẼ');
                    setIsQuoteModalOpen(true);
                  }}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-semibold text-[13px] h-[46px] px-6 rounded-[4px] flex items-center justify-center gap-2 shrink-0 transition-colors whitespace-nowrap cursor-pointer"
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

      <FloatingContactBubble
        onClick={() => {
          setQuoteTargetSku('');
          setIsQuoteModalOpen(true);
        }}
      />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialSku={quoteTargetSku}
      />
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
          <Loader2 className="w-10 h-10 text-[#0b132b] animate-spin mb-3" />
          <p className="text-[14px] text-[#475569]">Đang tải danh mục thiết bị AXIOM...</p>
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
