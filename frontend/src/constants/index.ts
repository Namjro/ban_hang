export const SAMPLE_PRODUCT_IMAGES: readonly string[] = [
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

export const PRESET_CERTIFICATES: readonly string[] = [
  'CO/CQ Gốc Nhà Máy',
  'ISO 9001:2015 Quản Lý Chất Lượng',
  'Chứng Nhận Hợp Chuẩn CE Directive',
  'Tiêu Chuẩn RoHS',
  'Biên Bản Kiểm Định KCS AXIOM',
  'Mill Test Certificate (MTR)',
  'JIS B 7507 Tiêu Chuẩn Công Nghiệp Nhật',
];

export const BRAND_FILTER_OPTIONS: readonly string[] = [
  '',
  'Axiom',
  'Mitutoyo',
  'Vertex',
  'SKF',
  'Sandvik Coromant',
  'SMC Pneumatics',
];

export const STOCK_FILTER_OPTIONS = [
  { val: '', label: 'Tất cả' },
  { val: 'in_stock', label: 'Hàng có sẵn' },
  { val: 'low_stock', label: 'Sắp hết hàng' },
  { val: 'pre_order', label: 'Đặt hàng theo lịch' },
] as const;

export const COMPANY_INFO = {
  name: 'AXIOM Industrial Supply',
  hotlineDisplay: '0988.123.456',
  hotlineTel: 'tel:0988123456',
  email: 'sales@axiom.vn',
  address: 'Lô E2, Khu Công Nghiệp Tân Bình, TP. Hồ Chí Minh',
  zaloUrl: 'https://zalo.me',
} as const;
