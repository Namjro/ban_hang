import { StockStatus } from '@/lib/types';

export interface SpecRow {
  key: string;
  value: string;
}

export interface ProductFormState {
  category_id: number;
  sku: string;
  name: string;
  brand: string;
  stock_status: StockStatus;
  price_display: string;
  description: string;
  images: string[];
  specRows: SpecRow[];
  spec_summary: string;
  certificates: string[];
  datasheet_url: string;
  is_featured: boolean;
  show_in_quick_specs: boolean;
  quick_spec_order: number;
  highlights: string[];
  packaging: string[];
  newImageUrl: string;
  customCertInput: string;
}
