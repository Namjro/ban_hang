import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import JsonLd from '@/components/seo/JsonLd';
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
  const { slug } = await params;
  const [productRes, siteSettings] = await Promise.all([
    getServerProductBySlug(slug),
    getServerSiteSettings(),
  ]);

  if (!productRes?.data) {
    return {
      title: 'Không tìm thấy sản phẩm | AXIOM',
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(productRes.data, siteSettings);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const [productRes, siteSettings] = await Promise.all([
    getServerProductBySlug(slug),
    getServerSiteSettings(),
  ]);

  if (!productRes?.data) {
    notFound();
  }

  const product = productRes.data;
  const relatedProducts = productRes.related_products || [];

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

  const productJsonLd = buildProductJsonLd(product, siteSettings.company);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        settings={siteSettings}
      />
    </>
  );
}
