'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ShieldCheck,
  Check,
  PhoneCall,
  FileText,
  Package,
  Layers,
  Award,
  ArrowRight,
  Loader2,
  FileDown,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal quote
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetSku, setQuoteTargetSku] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'certs'>('desc');

  // Fallback sample images
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

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.get(`/products/${slug}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data.success && res.data.data) {
          setProduct(res.data.data);
          if (res.data.related_products) {
            setRelatedProducts(res.data.related_products);
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
          <h2 className="text-[18px] font-bold text-[#0b132b]">Đang tải thông số kỹ thuật sản phẩm...</h2>
          <p className="text-[13px] text-[#475569] mt-1">Truy xuất dữ liệu kho và hồ sơ CO/CQ chính hãng.</p>
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

  // Determine gallery images
  const imagesList: string[] = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : [sampleImages[product.id % sampleImages.length]]);

  // Selected image
  const currentImage = imagesList[activeImageIndex] || imagesList[0] || sampleImages[0];

  // Certificates list
  const certList: string[] = (Array.isArray(product.certificates) && product.certificates.length > 0)
    ? product.certificates
    : (product.has_cocq ? ['CO/CQ Gốc Nhà Sản Xuất', 'Chứng Nhận Chất Lượng Xuất Xưởng ISO 9001:2015', 'Kiểm Định Dung Sai KCS AXIOM'] : []);

  // Specifications
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

        {/* Product Hero Section (2 Columns: Left Gallery, Right Details & Actions) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Multi-Image Interactive Gallery (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-[#dce2ea] rounded-[8px] p-5 shadow-xs flex flex-col gap-4">
              {/* Main Viewport */}
              <div className="relative w-full h-[380px] sm:h-[440px] bg-[#f8fafc] rounded-[6px] border border-[#dce2ea] overflow-hidden flex items-center justify-center p-6 group">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  unoptimized={currentImage.startsWith('data:') || currentImage.startsWith('http')}
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges on Main Image */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="bg-[#0b132b] text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-[2px] tracking-wider shadow-xs">
                    {product.sku}
                  </span>
                  <span className="bg-[#152039] text-[#f59e0b] border border-[#475569] text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                    {product.brand}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  {product.stock_status === 'in_stock' ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px] flex items-center gap-1 shadow-2xs">
                      <Check className="w-3.5 h-3.5" /> Có sẵn trong kho
                    </span>
                  ) : product.stock_status === 'low_stock' ? (
                    <span className="bg-amber-50 text-amber-700 border border-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                      Sắp hết hàng
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                      Đặt hàng theo lịch
                    </span>
                  )}
                </div>

                {/* Navigation arrows for images if multiple */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#dce2ea] text-[#0b132b] flex items-center justify-center hover:bg-[#0b132b] hover:text-white transition-colors cursor-pointer shadow-xs opacity-0 group-hover:opacity-100"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#dce2ea] text-[#0b132b] flex items-center justify-center hover:bg-[#0b132b] hover:text-white transition-colors cursor-pointer shadow-xs opacity-0 group-hover:opacity-100"
                      aria-label="Ảnh kế tiếp"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-[72px] h-[72px] rounded-[4px] border overflow-hidden shrink-0 bg-[#f8fafc] transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#0b132b] ring-2 ring-[#0b132b] scale-102'
                          : 'border-[#dce2ea] hover:border-[#0b132b]/60 opacity-80 hover:opacity-100'
                      }`}
                      aria-label={`Xem ảnh ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Ảnh góc ${idx + 1}`}
                        fill
                        unoptimized={img.startsWith('data:') || img.startsWith('http')}
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality & Origin Banner */}
              <div className="bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] p-3 flex items-center justify-between text-[12px] text-[#475569]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>Hồ sơ CO/CQ đầy đủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0b132b]" />
                  <span>Giao nhanh 24-48h</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Product Specs & Commercial CTA (7 Cols) */}
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
                          <span className="font-semibold text-[#0b132b] text-right truncate pl-2">{val}</span>
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
                    href="tel:0988666888"
                    className="bg-[#0b132b] hover:bg-[#152039] text-white font-semibold text-[13px] h-[48px] px-5 rounded-[4px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#f59e0b]" />
                    <span>Hotline: 0988.xxx.xxx</span>
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
                  className="bg-white text-[#0b132b] hover:bg-[#f8fafc] text-[12px] font-bold h-[38px] px-4 rounded-[4px] shrink-0 transition-colors"
                >
                  Tư Vấn Riêng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information: Specs, Description, Certificates */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] mt-10">
          <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
            {/* Tabs Header */}
            <div className="flex border-b border-[#dce2ea] bg-[#f8fafc] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`px-6 py-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'desc'
                    ? 'border-[#0b132b] text-[#0b132b] bg-white'
                    : 'border-transparent text-[#475569] hover:text-[#0b132b]'
                }`}
              >
                <FileText className="w-4 h-4 text-[#f59e0b]" />
                <span>Mô Tả Sản Phẩm & Ứng Dụng</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'border-[#0b132b] text-[#0b132b] bg-white'
                    : 'border-transparent text-[#475569] hover:text-[#0b132b]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#f59e0b]" />
                <span>Bảng Thông Số Kỹ Thuật Chi Tiết ({specsEntries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('certs')}
                className={`px-6 py-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'certs'
                    ? 'border-[#0b132b] text-[#0b132b] bg-white'
                    : 'border-transparent text-[#475569] hover:text-[#0b132b]'
                }`}
              >
                <Award className="w-4 h-4 text-[#f59e0b]" />
                <span>Chứng Chỉ & Tiêu Chuẩn Xuất Xưởng ({certList.length})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 sm:p-8">
              {/* TAB 1: Mô Tả */}
              {activeTab === 'desc' && (
                <div className="flex flex-col gap-6 max-w-[960px]">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#0b132b] mb-3">
                      Giới Thiệu Chung & Mục Đích Sử Dụng
                    </h3>
                    <p className="text-[14px] text-[#475569] leading-relaxed whitespace-pre-line">
                      {product.description ||
                        `${product.name} là dòng sản phẩm cao cấp thuộc thương hiệu ${product.brand}, được AXIOM Industrial Supply nhập khẩu và phân phối trực tiếp cho các nhà máy cơ khí chế tạo, phân xưởng gia công CNC và các doanh nghiệp sản xuất phụ tùng chính xác.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc]">
                      <h4 className="text-[14px] font-bold text-[#0b132b] mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                        Ưu Điểm Nổi Bật
                      </h4>
                      <ul className="text-[13px] text-[#475569] space-y-1.5 list-disc list-inside">
                        <li>Dung sai đồng đều, gia công chính xác theo chuẩn ISO.</li>
                        <li>Độ cứng bề mặt vượt trội, kéo dài tuổi thọ sử dụng.</li>
                        <li>Tương thích chuẩn công nghiệp quốc tế (JIS, DIN, ANSI).</li>
                        <li>Kháng rung động và tản nhiệt tối ưu trong ca vận hành liên tục.</li>
                      </ul>
                    </div>

                    <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc]">
                      <h4 className="text-[14px] font-bold text-[#0b132b] mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#f59e0b]" />
                        Quy Cách Đóng Gói & Xuất Xưởng
                      </h4>
                      <ul className="text-[13px] text-[#475569] space-y-1.5 list-disc list-inside">
                        <li>Hộp bảo vệ chống ẩm, chống sốc và chống gỉ sét VCI.</li>
                        <li>Kèm tem mã vạch truy xuất nguồn gốc SKU chính hãng.</li>
                        <li>Chứng thư kiểm định (Inspection Certificate) kèm theo hộp.</li>
                        <li>Tài liệu hướng dẫn vận hành và bảo trì máy.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Thông Số Kỹ Thuật */}
              {activeTab === 'specs' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2">
                    <div>
                      <h3 className="text-[18px] font-bold text-[#0b132b]">
                        Bảng Thông Số Kỹ Thuật (Engineering Specification Sheet)
                      </h3>
                      <p className="text-[13px] text-[#475569]">
                        Được kiểm tra bởi phòng KCS AXIOM trước khi nhập kho.
                      </p>
                    </div>
                  </div>

                  {specsEntries.length === 0 ? (
                    <div className="p-8 text-center text-[#475569] text-[13px]">
                      Sản phẩm đang được phòng kỹ thuật cập nhật thông số chi tiết.
                    </div>
                  ) : (
                    <div className="border border-[#dce2ea] rounded-[6px] overflow-hidden">
                      <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                          <tr>
                            <th className="py-3 px-5 w-1/3">Thuộc Tính Kỹ Thuật</th>
                            <th className="py-3 px-5">Giá Trị / Tiêu Chuẩn Thực Tế</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dce2ea]">
                          <tr className="hover:bg-[#f8fafc]">
                            <td className="py-3 px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                              Mã Định Danh (SKU)
                            </td>
                            <td className="py-3 px-5 font-mono font-bold text-[#0b132b]">
                              {product.sku}
                            </td>
                          </tr>
                          <tr className="hover:bg-[#f8fafc]">
                            <td className="py-3 px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                              Nhà Sản Xuất / Thương Hiệu
                            </td>
                            <td className="py-3 px-5 font-medium text-[#0b132b]">
                              {product.brand}
                            </td>
                          </tr>
                          <tr className="hover:bg-[#f8fafc]">
                            <td className="py-3 px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                              Nhóm Phân Loại
                            </td>
                            <td className="py-3 px-5 text-[#475569]">
                              {product.category?.name || 'Vật tư kỹ thuật'}
                            </td>
                          </tr>
                          {specsEntries.map(([key, val], idx) => (
                            <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                              <td className="py-3 px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                                {key}
                              </td>
                              <td className="py-3 px-5 text-[#0b132b] font-medium">
                                {val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Chứng Chỉ */}
              {activeTab === 'certs' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#0b132b] mb-1">
                      Chứng Chỉ Xuất Xưởng & Pháp Lý Hàng Hóa
                    </h3>
                    <p className="text-[13px] text-[#475569]">
                      AXIOM cam kết cung cấp trọn bộ hồ sơ CO/CQ gốc và chứng nhận hợp chuẩn cho các dự án công nghiệp.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certList.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] p-5 flex flex-col justify-between gap-4 hover:border-[#0b132b] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-[14px] font-bold text-[#0b132b] leading-snug">
                              {cert}
                            </h4>
                            <span className="text-[11px] text-[#10b981] font-semibold mt-0.5 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Đã kiểm định hiệu lực
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#475569] border-t border-[#dce2ea] pt-3 flex items-center justify-between">
                          <span>KCS AXIOM Verified</span>
                          <span className="font-mono text-[#0b132b]">ISO/IEC 17025</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f8fafc] border border-dashed border-[#475569] rounded-[6px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileDown className="w-6 h-6 text-[#0b132b]" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#0b132b]">
                          Yêu cầu hồ sơ kỹ thuật đầy đủ (Dossier CO/CQ bản cứng)
                        </span>
                        <span className="text-[12px] text-[#475569]">
                          Cung cấp theo số hợp đồng dự án và biên bản bàn giao nghiệm thu.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQuoteModal(`${product.sku} - YÊU CẦU HỒ SƠ CO/CQ`)}
                      className="bg-[#0b132b] hover:bg-[#152039] text-white text-[12px] font-semibold h-[38px] px-4 rounded-[4px] shrink-0 transition-colors cursor-pointer"
                    >
                      Yêu Cầu Trích Xuất CO/CQ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
                const relImg = (Array.isArray(rel.images) && rel.images[0]) || rel.image_url || sampleImages[rIdx % sampleImages.length];

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
                        <span className="text-[11px] font-semibold text-[#10b981]">CO/CQ đầy đủ</span>
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
