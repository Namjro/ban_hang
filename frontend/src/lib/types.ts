export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  products_count?: number;
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
  description: string | null;
  specifications: Record<string, string> | null;
  stock_status: 'in_stock' | 'low_stock' | 'pre_order';
  price_display: string;
  has_cocq: boolean;
  is_featured: boolean;
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
  source: 'landing_form' | 'contact_modal';
  status: 'new' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
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
}
