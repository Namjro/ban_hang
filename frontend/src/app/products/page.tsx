import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import ProductsCatalogClient from '@/components/products/ProductsCatalogClient';
import JsonLd from '@/components/seo/JsonLd';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import type {
  Category,
  PaginatedApiResponse,
  Product,
  SiteSettings,
} from '@/lib/types';
import {
  buildBreadcrumbJsonLd,
  buildCatalogMetadata,
  buildCollectionPageJsonLd,
  generateCategorySeoFallback,
} from '@/lib/seo';
import {
  getServerPublicBrands,
  getServerPublicCategories,
  getServerPublicProducts,
  getServerSiteSettings,
} from '@/services/server-public.service';

export const dynamic = 'force-dynamic';

interface ProductsCatalogPageProps {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    brand?: string;
    stock_status?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsCatalogPageProps): Promise<Metadata> {
  try {
    const resolvedParams = searchParams ? (await searchParams) : {};
    const categorySlug = resolvedParams?.category || '';
    const search = resolvedParams?.search || '';
    const brand = resolvedParams?.brand || '';
    const stockStatus = resolvedParams?.stock_status || '';

    const [categories, siteSettings] = await Promise.all([
      getServerPublicCategories().catch(() => []),
      getServerSiteSettings().catch(() => DEFAULT_SITE_SETTINGS),
    ]);

    const safeCategories = Array.isArray(categories) ? categories : [];
    const activeCategory = categorySlug
      ? safeCategories.find((c) => c?.slug === categorySlug) || null
      : null;

    return buildCatalogMetadata({
      category: activeCategory,
      search,
      brand,
      stockStatus,
      siteSettings: siteSettings || DEFAULT_SITE_SETTINGS,
    });
  } catch (err) {
    console.error('Failed to generate catalog metadata', err);
    return buildCatalogMetadata({});
  }
}

export default async function ProductsCatalogPage({
  searchParams,
}: ProductsCatalogPageProps) {
  let categorySlug = '';
  let search = '';
  let brand = '';
  let stockStatus = '';
  let page = 1;

  let safeCategories: Category[] = [];
  let safeBrands: string[] = [];
  let safeProductsRes: PaginatedApiResponse<Product> = {
    success: false,
    data: [],
    pagination: { total: 0, per_page: 12, current_page: 1, last_page: 1 },
  };
  let safeSettings: SiteSettings = DEFAULT_SITE_SETTINGS;

  try {
    const resolvedParams = searchParams ? (await searchParams) : {};
    categorySlug = resolvedParams?.category || '';
    search = resolvedParams?.search || '';
    brand = resolvedParams?.brand || '';
    stockStatus = resolvedParams?.stock_status || '';
    page = Number(resolvedParams?.page) || 1;

    const [categories, brands, productsRes, siteSettings] = await Promise.all([
      getServerPublicCategories().catch(() => []),
      getServerPublicBrands().catch(() => []),
      getServerPublicProducts({
        page,
        per_page: 12,
        category: categorySlug || undefined,
        search: search || undefined,
        brand: brand || undefined,
        stock_status: stockStatus || undefined,
      }).catch(() => ({
        success: false,
        data: [],
        pagination: { total: 0, per_page: 12, current_page: 1, last_page: 1 },
      })),
      getServerSiteSettings().catch(() => DEFAULT_SITE_SETTINGS),
    ]);

    safeCategories = Array.isArray(categories) ? categories : [];
    safeBrands = Array.isArray(brands) ? brands : [];
    if (productsRes && Array.isArray(productsRes.data)) {
      safeProductsRes = productsRes;
    }
    safeSettings = siteSettings || DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.error('Failed to load data in ProductsCatalogPage', err);
  }

  const activeCategory = categorySlug
    ? safeCategories.find((c) => c?.slug === categorySlug) || null
    : null;

  const breadcrumbItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tất cả sản phẩm', path: '/products' },
  ];
  if (activeCategory) {
    breadcrumbItems.push({
      name: activeCategory.name,
      path: `/products?category=${encodeURIComponent(activeCategory.slug)}`,
    });
  }

  const categoryFallback = activeCategory
    ? generateCategorySeoFallback(activeCategory)
    : null;

  const collectionJsonLd = buildCollectionPageJsonLd({
    title:
      activeCategory?.meta_title ||
      categoryFallback?.meta_title ||
      'Danh Mục Thiết Bị Công Nghiệp AXIOM',
    description:
      activeCategory?.meta_description ||
      categoryFallback?.meta_description ||
      'Tra cứu thiết bị công nghiệp, dụng cụ cơ khí chính xác sẵn kho tại AXIOM.',
    path: activeCategory
      ? `/products?category=${encodeURIComponent(activeCategory.slug)}`
      : '/products',
    products: safeProductsRes.data,
  });

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={collectionJsonLd} />
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
            <Loader2 className="w-10 h-10 text-[#0b132b] animate-spin mb-3" />
            <p className="text-[14px] text-[#475569]">Đang tải danh mục thiết bị AXIOM...</p>
          </div>
        }
      >
        <ProductsCatalogClient
          initialProducts={safeProductsRes.data}
          initialPagination={safeProductsRes.pagination}
          initialCategories={safeCategories}
          initialBrands={safeBrands}
          initialCategorySlug={categorySlug}
          initialSearch={search}
          initialBrand={brand}
          initialStockStatus={stockStatus}
          siteSettings={safeSettings}
        />
      </Suspense>
    </>
  );
}
