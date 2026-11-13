import { DEFAULT_SITE_SETTINGS } from '@/constants';
import type {
  ApiResponse,
  Category,
  PaginatedApiResponse,
  Product,
  ProductDetailResponse,
  ProductFilterParams,
  SiteSettings,
} from '@/lib/types';

const SERVER_API_BASE_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api'
).replace(/\/+$/, '');

export interface SitemapProductEntry {
  slug: string;
  name: string;
  image_url: string | null;
  updated_at: string | null;
}

async function fetchServerJson<T>(
  path: string,
  revalidateSeconds = 120
): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API_BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getServerSiteSettings(): Promise<SiteSettings> {
  const res = await fetchServerJson<ApiResponse<Partial<SiteSettings>>>('/settings', 300);
  if (!res?.success || !res.data) {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    company: { ...DEFAULT_SITE_SETTINGS.company, ...res.data.company },
    hero: { ...DEFAULT_SITE_SETTINGS.hero, ...res.data.hero },
    trust_stats: { ...DEFAULT_SITE_SETTINGS.trust_stats, ...res.data.trust_stats },
    capabilities: { ...DEFAULT_SITE_SETTINGS.capabilities, ...res.data.capabilities },
    product_detail: {
      ...DEFAULT_SITE_SETTINGS.product_detail,
      ...res.data.product_detail,
    },
  };
}

export async function getServerPublicCategories(params?: {
  home?: boolean;
}): Promise<Category[]> {
  const query = params?.home ? '?home=1' : '';
  const res = await fetchServerJson<ApiResponse<Category[]>>(
    `/categories${query}`,
    300
  );
  return res?.success && Array.isArray(res.data) ? res.data : [];
}

export async function getServerHomeFeaturedProducts(): Promise<Product[]> {
  const res = await fetchServerJson<ApiResponse<Product[]>>(
    '/products/home-featured',
    120
  );
  return res?.success && Array.isArray(res.data) ? res.data : [];
}

export async function getServerQuickSpecProducts(): Promise<Product[]> {
  const res = await fetchServerJson<ApiResponse<Product[]>>(
    '/products/quick-specs',
    120
  );
  return res?.success && Array.isArray(res.data) ? res.data : [];
}

export async function getServerPublicBrands(): Promise<string[]> {
  const res = await fetchServerJson<ApiResponse<string[]>>('/products/brands', 300);
  return res?.success && Array.isArray(res.data) ? res.data : [];
}

export async function getServerPublicProducts(
  params?: ProductFilterParams
): Promise<PaginatedApiResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.per_page) searchParams.set('per_page', String(params.per_page));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.brand) searchParams.set('brand', params.brand);
  if (params?.stock_status) searchParams.set('stock_status', params.stock_status);
  if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));
  if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params?.sort_order) searchParams.set('sort_order', params.sort_order);

  const query = searchParams.toString();
  const res = await fetchServerJson<PaginatedApiResponse<Product>>(
    `/products${query ? `?${query}` : ''}`,
    60
  );

  if (!res?.success) {
    return {
      success: false,
      data: [],
      pagination: { total: 0, per_page: 12, current_page: 1, last_page: 1 },
    };
  }

  return res;
}

export async function getServerProductBySlug(
  slug: string
): Promise<ProductDetailResponse | null> {
  const res = await fetchServerJson<ProductDetailResponse>(
    `/products/${encodeURIComponent(slug)}`,
    60
  );
  if (!res?.success || !res.data) {
    return null;
  }
  return res;
}

export async function getServerSitemapProducts(): Promise<SitemapProductEntry[]> {
  const res = await fetchServerJson<ApiResponse<SitemapProductEntry[]>>(
    '/products/sitemap',
    300
  );
  return res?.success && Array.isArray(res.data) ? res.data : [];
}
