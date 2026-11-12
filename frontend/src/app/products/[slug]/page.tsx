import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  buildProductMetadata,
} from '@/lib/seo';
import {
  getServerProductBySlug,
  getServerSiteSettings,
} from '@/services/server-public.service';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const [productRes, siteSettings] = await Promise.all([
      getServerProductBySlug(slug).catch(() => null),
      getServerSiteSettings().catch(() => DEFAULT_SITE_SETTINGS),
    ]);

    if (!productRes?.data) {
      return {
        title: 'Chi Tiết Sản Phẩm | AXIOM',
        description: 'Xem thông số kỹ thuật và báo giá thiết bị công nghiệp chính hãng tại AXIOM.',
        robots: { index: false, follow: false },
      };
    }

    return buildProductMetadata(productRes.data, siteSettings || DEFAULT_SITE_SETTINGS);
  } catch (err) {
    console.error('Failed to generate product metadata', err);
    return {
      title: 'Thiết Bị Công Nghiệp Chính Hãng | AXIOM',
      robots: { index: false, follow: false },
    };
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  let slug = '';
  try {
    const resolved = await params;
    slug = resolved?.slug || '';
  } catch {
    notFound();
  }

  if (!slug) {
    notFound();
  }

  const [productRes, siteSettings] = await Promise.all([
    getServerProductBySlug(slug).catch(() => null),
    getServerSiteSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);

  if (!productRes?.data) {
    notFound();
  }

  const product = productRes.data;
  const relatedProducts = Array.isArray(productRes.related_products)
    ? productRes.related_products
    : [];
  const safeSettings = siteSettings || DEFAULT_SITE_SETTINGS;

  const breadcrumbItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tất cả sản phẩm', path: '/products' },
  ];
  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      path: `/products?category=${encodeURIComponent(product.category.slug)}`,
    });
  }
  breadcrumbItems.push({
    name: product.name,
    path: `/products/${encodeURIComponent(product.slug)}`,
  });

  const productJsonLd = buildProductJsonLd(product, safeSettings.company);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        settings={safeSettings}
      />
    </>
  );
}
