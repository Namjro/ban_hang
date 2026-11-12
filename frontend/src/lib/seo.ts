import type { Metadata } from 'next';
import type { Category, CompanySettings, Product, SiteSettings } from './types';
import { DEFAULT_SITE_SETTINGS } from '@/constants';

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'http://localhost:3000';
  return envUrl.replace(/\/+$/, '');
}

function truncateText(text: string, maxLength: number): string {
  const cleaned = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}

function parseKeywords(raw?: string | null): string[] | undefined {
  if (!raw) return undefined;
  const list = raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  return list.length > 0 ? list : undefined;
}

export function generateProductSeoFallback(product: Pick<
  Product,
  'name' | 'sku' | 'brand' | 'spec_summary' | 'description' | 'category'
>) {
  const brand = product.brand || 'Axiom';
  const baseTitle = product.sku ? `${product.name} (${product.sku})` : product.name;
  const autoTitle =
    brand && !baseTitle.toLowerCase().includes(brand.toLowerCase())
      ? `${baseTitle} - ${brand}`
      : baseTitle;

  const descParts = [product.name];
  if (product.sku) descParts.push(`Mã ${product.sku}`);
  if (product.spec_summary) {
    descParts.push(product.spec_summary);
  } else if (product.description) {
    descParts.push(truncateText(product.description, 90));
  }
  descParts.push(`Chính hãng ${brand}, đầy đủ CO/CQ, báo giá nhanh B2B.`);

  const keywords = Array.from(
    new Set(
      [
        product.name,
        product.sku,
        brand,
        product.category?.name,
        'thiết bị công nghiệp',
        'vật tư cơ khí chính hãng',
      ].filter((v): v is string => Boolean(v && v.trim()))
    )
  ).join(', ');

  return {
    meta_title: truncateText(autoTitle, 70),
    meta_description: truncateText(descParts.join(' - '), 160),
    meta_keywords: keywords,
  };
}

export function generateCategorySeoFallback(category: Pick<
  Category,
  'name' | 'subtitle' | 'description'
>) {
  const autoTitle = category.subtitle
    ? `${category.name} - ${category.subtitle}`
    : `${category.name} Công Nghiệp Chính Hãng`;

  const autoDesc = category.description
    ? `${truncateText(category.description, 115)} Đầy đủ CO/CQ, báo giá B2B nhanh.`
    : `Danh mục ${category.name} công nghiệp chính hãng tại AXIOM. Kho hàng sẵn có, đầy đủ chứng từ CO/CQ, hỗ trợ báo giá kỹ thuật nhanh cho doanh nghiệp.`;

  const keywords = Array.from(
    new Set(
      [
        category.name,
        category.subtitle,
        'thiết bị công nghiệp',
        'vật tư công nghiệp',
        'AXIOM',
      ].filter((v): v is string => Boolean(v && v.trim()))
    )
  ).join(', ');

  return {
    meta_title: truncateText(autoTitle, 70),
    meta_description: truncateText(autoDesc, 160),
    meta_keywords: keywords,
  };
}

export function buildHomeMetadata(settings: SiteSettings = DEFAULT_SITE_SETTINGS): Metadata {
  const company = settings.company || DEFAULT_SITE_SETTINGS.company;
  const hero = settings.hero || DEFAULT_SITE_SETTINGS.hero;
  const title = `${company.name} — ${company.tagline}`;
  const description = truncateText(hero.subtitle || DEFAULT_SITE_SETTINGS.hero.subtitle, 160);
  const ogImage = hero.slides?.[0]?.image_url || hero.image_url || '/assets/images/cnc-machinery.png';

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: company.name,
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function buildCatalogMetadata(options: {
  category?: Category | null;
  search?: string;
  brand?: string;
  stockStatus?: string;
  siteSettings?: SiteSettings;
}): Metadata {
  const { category, search, brand, stockStatus, siteSettings } = options;
  const companyName = siteSettings?.company?.name || 'AXIOM';
  const hasSecondaryFilters = Boolean(search || brand || stockStatus);

  if (category) {
    const fallback = generateCategorySeoFallback(category);
    const title = category.meta_title?.trim() || fallback.meta_title;
    const description = category.meta_description?.trim() || fallback.meta_description;
    const keywords = parseKeywords(category.meta_keywords || fallback.meta_keywords);
    const canonicalPath = `/products?category=${encodeURIComponent(category.slug)}`;
    const ogImage = category.image_url || '/assets/images/cnc-machinery.png';

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalPath,
      },
      robots: hasSecondaryFilters
        ? { index: false, follow: true }
        : { index: true, follow: true },
      openGraph: {
        title: `${title} | ${companyName}`,
        description,
        url: canonicalPath,
        siteName: companyName,
        locale: 'vi_VN',
        type: 'website',
        images: [{ url: ogImage, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | ${companyName}`,
        description,
        images: [ogImage],
      },
    };
  }

  const title = search
    ? `Tìm kiếm "${search}" — Danh Mục Sản Phẩm`
    : 'Danh Mục Thiết Bị & Vật Tư Công Nghiệp Chính Hãng';
  const description =
    'Tra cứu danh mục máy móc công nghiệp, dụng cụ cơ khí chính xác, linh kiện thay thế và thiết bị nhà xưởng sẵn kho tại AXIOM. Đầy đủ CO/CQ, báo giá nhanh B2B.';

  return {
    title,
    description,
    alternates: {
      canonical: '/products',
    },
    robots: hasSecondaryFilters
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${companyName}`,
      description,
      url: '/products',
      siteName: companyName,
      locale: 'vi_VN',
      type: 'website',
    },
  };
}

export function buildProductMetadata(
  product: Product,
  siteSettings?: SiteSettings
): Metadata {
  const companyName = siteSettings?.company?.name || 'AXIOM';
  const fallback = generateProductSeoFallback(product);
  const title = product.meta_title?.trim() || fallback.meta_title;
  const description = product.meta_description?.trim() || fallback.meta_description;
  const keywords = parseKeywords(product.meta_keywords || fallback.meta_keywords);
  const canonicalPath = `/products/${product.slug}`;
  const primaryImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image_url ||
    '/assets/images/cnc-machinery.png';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ${companyName}`,
      description,
      url: canonicalPath,
      siteName: companyName,
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: primaryImage,
          alt: `${product.name} - Mã ${product.sku} - ${product.brand}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${companyName}`,
      description,
      images: [primaryImage],
    },
  };
}

export function buildOrganizationJsonLd(company: CompanySettings) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.tagline,
    url: siteUrl,
    email: company.email,
    telephone: company.hotline_tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressCountry: 'VN',
    },
  };
}

export function buildWebSiteJsonLd(company: CompanySettings) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function buildCollectionPageJsonLd(options: {
  title: string;
  description: string;
  path: string;
  products: Product[];
}) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: options.title,
    description: options.description,
    url: `${siteUrl}${options.path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: options.products.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/products/${product.slug}`,
        name: product.name,
      })),
    },
  };
}

export function buildProductJsonLd(product: Product, company: CompanySettings) {
  const siteUrl = getSiteUrl();
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];

  const availabilityMap: Record<Product['stock_status'], string> = {
    in_stock: 'https://schema.org/InStock',
    low_stock: 'https://schema.org/LimitedAvailability',
    pre_order: 'https://schema.org/PreOrder',
  };

  const fallback = generateProductSeoFallback(product);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: product.meta_description || fallback.meta_description,
    image: images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
    brand: {
      '@type': 'Brand',
      name: product.brand || company.name,
    },
    category: product.category?.name || 'Thiết bị công nghiệp',
    url: `${siteUrl}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'VND',
      availability: availabilityMap[product.stock_status] || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: company.name,
      },
    },
  };
}
