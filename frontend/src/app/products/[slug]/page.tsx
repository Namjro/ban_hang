'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  PhoneCall,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductDetailTabs from '@/components/products/ProductDetailTabs';
import { productService } from '@/services';
import { Product } from '@/lib/types';
import { COMPANY_INFO, SAMPLE_PRODUCT_IMAGES } from '@/constants';

function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal quote
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetSku, setQuoteTargetSku] = useState('');

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    productService
      .getPublicProductBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.related_products) {
            setRelatedProducts(res.related_products);
          }
        } else {
          setError('Không tìm thấy thông tin sản phẩm yêu cầu.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm hoặc sản phẩm không tồn tại.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleOpenQuoteModal = (targetSku?: string) => {
    setQuoteTargetSku(targetSku || product?.sku || '');
    setIsQuoteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />
        <main className="flex-1 flex flex-col items-center justify-center p-12">
          <Loader2 className="w-10 h-10 text-[#0b132b] animate-spin mb-4" />
          <h2 className="text-[18px] font-bold text-[#0b132b]">
            Đang tải thông số kỹ thuật sản phẩm...
          </h2>
          <p className="text-[13px] text-[#475569] mt-1">
            Truy xuất dữ liệu kho và hồ sơ CO/CQ chính hãng.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0b132b] mb-2">Không tìm thấy sản phẩm</h1>
          <p className="text-[14px] text-[#475569] max-w-[480px] mb-6">
            Sản phẩm bạn đang tìm kiếm có thể đã được thay đổi mã SKU hoặc tạm ngừng cung ứng.
          </p>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-semibold h-[42px] px-6 rounded-[4px] flex items-center gap-2 transition-colors"
            >
              Xem danh mục sản phẩm
            </Link>
            <Link
              href="/"
              className="bg-white border border-[#dce2ea] hover:bg-[#f8fafc] text-[#0b132b] text-[13px] font-semibold h-[42px] px-6 rounded-[4px] flex items-center transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const specsEntries = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
      <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-[#dce2ea] py-3.5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
            <nav className="flex items-center flex-wrap gap-2 text-[12px] text-[#475569]">
              <Link href="/" className="hover:text-[#0b132b] transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
              <Link href="/products" className="hover:text-[#0b132b] transition-colors">
                Tất cả sản phẩm
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
              <Link
                href={`/products?category=${product.category?.slug || ''}`}
                className="hover:text-[#0b132b] transition-colors"
              >
                {product.category?.name || 'Thiết bị công nghiệp'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="font-semibold text-[#0b132b] truncate max-w-[280px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Multi-Image Interactive Gallery */}
            <ProductImageGallery product={product} />

            {/* RIGHT: Product Specs & Commercial CTA */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="bg-white border border-[#dce2ea] rounded-[8px] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
                {/* Brand & Category row */}
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0b132b] uppercase tracking-wider bg-[#f8fafc] border border-[#dce2ea] px-2.5 py-1 rounded-[3px]">
                      {product.brand}
                    </span>
                    <span className="text-[#475569]">
                      {product.category?.name || 'Vật tư gia công cơ khí'}
                    </span>
                  </div>

                  <span className="font-mono text-[#475569] text-[11px]">
                    SKU: <strong className="text-[#0b132b]">{product.sku}</strong>
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0b132b] tracking-[-0.8px] leading-tight">
                  {product.name}
                </h1>

                {/* Pricing & Commercial Terms */}
                <div className="bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
                      Đơn Giá Dự Án / B2B
                    </span>
                    <div className="text-[24px] font-bold text-[#0b132b] leading-tight mt-0.5">
                      {product.price_display || 'Liên hệ báo giá'}
                    </div>
                    <span className="text-[11px] text-[#10b981] font-medium">
                      ✓ Chiết khấu 5% - 15% cho đơn hàng dự án & số lượng lớn
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end text-[12px] text-[#475569] border-t sm:border-t-0 sm:border-l border-[#dce2ea] pt-2 sm:pt-0 sm:pl-4">
                    <span>VAT 8% - 10% đầy đủ</span>
                    <span>Hóa đơn điện tử xuất trong ngày</span>
                  </div>
                </div>

                {/* Key Spec Snippet */}
                {specsEntries.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold text-[#0b132b] uppercase tracking-wider">
                      Thông Số Trọng Điểm
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {specsEntries.slice(0, 4).map(([key, val], idx) => (
                        <div
                          key={idx}
                          className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 flex items-center justify-between text-[12px]"
                        >
                          <span className="text-[#94a3b8] font-medium">{key}:</span>
                          <span className="font-semibold text-[#0b132b] text-right truncate pl-2">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commercial CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenQuoteModal(product.sku)}
                    className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-[#0b132b] font-bold text-[14px] h-[48px] px-6 rounded-[4px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <span>Yêu Cầu Báo Giá Nhanh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={COMPANY_INFO.hotlineTel}
                    className="bg-[#0b132b] hover:bg-[#152039] text-white font-semibold text-[13px] h-[48px] px-5 rounded-[4px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#f59e0b]" />
                    <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
                  </a>
                </div>

                {/* Assurance points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#dce2ea] text-[12px] text-[#475569]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Bảo hành chính hãng 12-24T</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Đổi trả nếu sai dung sai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>Kỹ sư hỗ trợ lắp đặt / test</span>
                  </div>
                </div>
              </div>

              {/* Sourcing card */}
              <div className="bg-[#152039] text-white rounded-[8px] p-5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[#f59e0b] text-[11px] font-bold uppercase tracking-wider">
                    CẦN BẢN VẼ HOẶC MÃ MODEL ĐẶC THÙ?
                  </span>
                  <p className="text-[13px] text-[#e8edf3]">
                    Gửi bản vẽ kỹ thuật CAD/STEP hoặc mã phôi hiếm để AXIOM nhập khẩu trực tiếp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenQuoteModal(`${product.sku} - ĐẶC TÍNH BẢN VẼ`)}
                  className="bg-white text-[#0b132b] hover:bg-[#f8fafc] text-[12px] font-bold h-[38px] px-4 rounded-[4px] shrink-0 transition-colors cursor-pointer"
                >
                  Tư Vấn Riêng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information */}
        <ProductDetailTabs product={product} onOpenQuoteModal={handleOpenQuoteModal} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] mt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                  DANH MỤC TƯƠNG ĐỒNG
                </span>
                <h3 className="text-[20px] font-bold text-[#0b132b]">
                  Sản Phẩm Cùng Nhóm {product.category?.name}
                </h3>
              </div>

              <Link
                href="/products"
                className="text-[13px] font-semibold text-[#0b132b] hover:text-[#d97706] flex items-center gap-1 transition-colors"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rel, rIdx) => {
                const relImg =
                  (Array.isArray(rel.images) && rel.images[0]) ||
                  rel.image_url ||
                  SAMPLE_PRODUCT_IMAGES[rIdx % SAMPLE_PRODUCT_IMAGES.length];

                return (
                  <div
                    key={rel.id}
                    className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-[#0b132b] transition-all group shadow-2xs hover:shadow-md"
                  >
                    <div>
                      <div className="relative h-[160px] bg-[#f8fafc] border-b border-[#dce2ea] flex items-center justify-center p-3">
                        <Image
                          src={relImg}
                          alt={rel.name}
                          fill
                          unoptimized={relImg.startsWith('data:') || relImg.startsWith('http')}
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-[#0b132b] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
                          {rel.sku}
                        </span>
                      </div>

                      <div className="p-3.5 flex flex-col gap-1.5">
                        <span className="text-[11px] text-[#475569] font-medium">{rel.brand}</span>
                        <a
                          href={`/products/${rel.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] font-bold text-[#0b132b] hover:text-[#d97706] line-clamp-2 leading-snug transition-colors"
                          title="Mở chi tiết sản phẩm"
                        >
                          {rel.name}
                        </a>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0">
                      <div className="flex items-center justify-between pt-2 border-t border-[#dce2ea]">
                        <span className="text-[11px] font-semibold text-[#10b981]">
                          CO/CQ đầy đủ
                        </span>
                        <a
                          href={`/products/${rel.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#0b132b] hover:text-[#d97706] flex items-center gap-0.5"
                        >
                          <span>Chi tiết</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <FloatingContactBubble onClick={() => handleOpenQuoteModal()} />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialSku={quoteTargetSku}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
          <Loader2 className="w-10 h-10 text-[#0b132b] animate-spin mb-3" />
          <p className="text-[14px] text-[#475569]">Đang tải trang sản phẩm...</p>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
