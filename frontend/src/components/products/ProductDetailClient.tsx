'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ContactModal from '@/components/landing/ContactModal';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductDetailTabs from '@/components/products/ProductDetailTabs';
import RelatedProductsSection from '@/components/products/RelatedProductsSection';
import Button from '@/components/ui/Button';
import { Product, SiteSettings } from '@/lib/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  settings: SiteSettings;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  settings,
}: ProductDetailClientProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetSku, setQuoteTargetSku] = useState(product.sku);

  const handleOpenQuoteModal = (targetSku?: string) => {
    setQuoteTargetSku(targetSku || product.sku);
    setIsQuoteModalOpen(true);
  };

  const specsEntries = product.specifications ? Object.entries(product.specifications) : [];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-surface border-b border-line py-3.5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-[12px] text-ink-muted">
              <Link href="/" className="hover:text-ink transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-dim" aria-hidden="true" />
              <Link href="/products" className="hover:text-ink transition-colors">
                Tất cả sản phẩm
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-dim" aria-hidden="true" />
              <Link
                href={`/products?category=${product.category?.slug || ''}`}
                className="hover:text-ink transition-colors"
              >
                {product.category?.name || 'Thiết bị công nghiệp'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-dim" aria-hidden="true" />
              <span className="font-semibold text-ink truncate max-w-[280px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <ProductImageGallery product={product} />

            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="bg-surface border border-line rounded-[8px] p-6 sm:p-7 shadow-axiom-card flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink uppercase tracking-wider bg-canvas border border-line px-2.5 py-1 rounded-[4px]">
                      {product.brand}
                    </span>
                    <span className="text-ink-muted">
                      {product.category?.name || 'Vật tư gia công cơ khí'}
                    </span>
                  </div>

                  <span className="font-mono text-ink-muted text-[12px]">
                    SKU: <strong className="text-ink">{product.sku}</strong>
                  </span>
                </div>

                <h1 className="text-[26px] sm:text-[32px] font-bold text-ink tracking-[-0.02em] leading-tight">
                  {product.name}
                </h1>

                <div className="bg-canvas border border-line rounded-[6px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">
                      Đơn Giá Dự Án / B2B
                    </span>
                    <div className="text-[24px] font-bold text-ink leading-tight mt-0.5">
                      {product.price_display || 'Liên hệ báo giá'}
                    </div>
                    <span className="text-[12px] text-emerald-700 font-medium mt-0.5">
                      {settings.product_detail.discount_note}
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end text-[12px] text-ink-muted border-t sm:border-t-0 sm:border-l border-line pt-2 sm:pt-0 sm:pl-4">
                    <span>{settings.product_detail.vat_note}</span>
                    <span>{settings.product_detail.invoice_note}</span>
                  </div>
                </div>

                {specsEntries.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
                      Thông Số Trọng Điểm
                    </span>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {specsEntries.slice(0, 4).map(([key, val], idx) => (
                        <div
                          key={idx}
                          className="bg-canvas border border-line rounded-[4px] px-3 py-2 flex items-center justify-between text-[12px]"
                        >
                          <dt className="text-ink-dim font-medium">{key}:</dt>
                          <dd className="font-semibold text-ink text-right truncate pl-2">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => handleOpenQuoteModal(product.sku)}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    <span>Yêu Cầu Báo Giá Nhanh</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>

                  <a
                    href={`tel:${settings.company.hotline_tel}`}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-semibold text-[13px] h-[50px] px-5 rounded-[4px] inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span>Hotline: {settings.company.hotline_display}</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-line text-[12px] text-ink-muted">
                  {settings.product_detail.guarantees.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy-800 text-white rounded-[8px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-amber-500 text-[12px] font-bold uppercase tracking-wider">
                    CẦN BẢN VẼ HOẶC MÃ MODEL ĐẶC THÙ?
                  </span>
                  <p className="text-[13px] text-ink-subtle">
                    Gửi bản vẽ kỹ thuật CAD/STEP hoặc mã phôi hiếm để AXIOM nhập khẩu trực tiếp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenQuoteModal(`${product.sku} - ĐẶC TÍNH BẢN VẼ`)}
                  className="bg-surface text-ink hover:bg-canvas text-[13px] font-bold min-h-[44px] px-4 rounded-[4px] shrink-0 transition-colors cursor-pointer"
                >
                  Tư Vấn Riêng
                </button>
              </div>
            </div>
          </div>
        </div>

        <ProductDetailTabs
          product={product}
          settings={settings.product_detail}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
        <RelatedProductsSection
          categoryName={product.category?.name}
          products={relatedProducts}
        />
      </main>

      <Footer company={settings.company} />

      <FloatingContactBubble onClick={() => handleOpenQuoteModal()} />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialSku={quoteTargetSku}
      />
    </div>
  );
}
