export type StockStatus = 'in_stock' | 'low_stock' | 'pre_order';
export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
export type QuoteSource = 'landing_form' | 'contact_modal';

export interface CategoryHighlight {
  label: string;
  value: string;
}

export interface Category {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url?: string | null;
  highlights?: CategoryHighlight[];
  show_on_home?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  order: number;
  products_count?: number;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  category_id: number;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  image_url: string | null;
  images?: string[] | null;
  certificates?: string[] | null;
  datasheet_url?: string | null;
  highlights?: string[] | null;
  packaging?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  description: string | null;
  specifications: Record<string, string> | null;
  spec_summary?: string | null;
  stock_status: StockStatus;
  price_display: string;
  has_cocq: boolean;
  is_featured: boolean;
  show_in_quick_specs?: boolean;
  quick_spec_order?: number;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface QuoteRequest {
  id: number;
  full_name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  sku_target: string | null;
  requirement_content: string | null;
  source: QuoteSource;
  status: QuoteStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AdminStats {
  overview: {
    total_products: number;
    in_stock_products: number;
    total_categories: number;
    total_quotes: number;
    new_quotes: number;
    contacted_quotes: number;
    quoted_quotes: number;
    completed_quotes: number;
  };
  recent_quotes: QuoteRequest[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, number>;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  meta?: Record<string, number>;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
  related_products?: Product[];
}

export interface ProductFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  brand?: string;
  stock_status?: string;
  featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AdminProductFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string | number;
  stock_status?: string;
}

export interface ProductPayload {
  category_id: number;
  sku: string;
  name: string;
  brand?: string;
  stock_status: StockStatus;
  price_display?: string;
  description?: string;
  image_url?: string;
  images?: string[];
  specifications?: Record<string, string>;
  spec_summary?: string | null;
  has_cocq?: boolean;
  certificates?: string[];
  datasheet_url?: string | null;
  highlights?: string[] | null;
  packaging?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  is_featured?: boolean;
  show_in_quick_specs?: boolean;
  quick_spec_order?: number;
}

export interface CategoryPayload {
  name: string;
  subtitle?: string | null;
  slug?: string;
  description?: string;
  icon?: string;
  image_url?: string | null;
  highlights?: CategoryHighlight[];
  show_on_home?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  order?: number;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  hotline_display: string;
  hotline_tel: string;
  hotline_note: string;
  email: string;
  address: string;
  zalo_url: string;
  zalo_label: string;
  copyright: string;
  footer_badge: string;
}

export interface IconTextItem {
  icon: string;
  text: string;
}

export interface HeroSlide {
  image_url: string;
  caption_left: string;
  caption_right: string;
}

export interface HeroSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: IconTextItem[];
  audience_note: string;
  image_url: string;
  caption_left: string;
  caption_right: string;
  slides?: HeroSlide[];
}

export interface TrustStatItem {
  icon: string;
  value: string;
  label: string;
}

export interface TrustStatsSettings {
  items: TrustStatItem[];
}

export interface CapabilityItem {
  icon: string;
  title: string;
  desc: string;
}

export interface CapabilitiesSettings {
  eyebrow: string;
  title: string;
  description: string;
  image_url: string;
  image_caption: string;
  items: CapabilityItem[];
}

export interface ProductDetailSettings {
  discount_note: string;
  vat_note: string;
  invoice_note: string;
  guarantees: string[];
  highlights: string[];
  packaging: string[];
  default_certificates: string[];
}

export interface SiteSettings {
  company: CompanySettings;
  hero: HeroSettings;
  trust_stats: TrustStatsSettings;
  capabilities: CapabilitiesSettings;
  product_detail: ProductDetailSettings;
}

export type SiteSettingGroup = keyof SiteSettings;

export interface QuoteRequestPayload {
  full_name: string;
  phone: string;
  company_name?: string;
  email?: string;
  sku_target?: string;
  requirement_content?: string;
  source?: QuoteSource;
}

export interface QuoteFilterParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export interface UpdateQuoteStatusPayload {
  status: QuoteStatus;
  admin_notes?: string;
}
