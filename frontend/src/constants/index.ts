import type { SiteSettings } from '@/lib/types';

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

export const SITE_ICON_OPTIONS = [
  { id: 'shield-check', label: 'Bảo chứng / Chứng nhận' },
  { id: 'package-check', label: 'Kho hàng sẵn có' },
  { id: 'factory', label: 'Nhà máy / Kinh nghiệm' },
  { id: 'boxes', label: 'SKU / Tồn kho' },
  { id: 'check-circle', label: 'Kiểm định / Chính hãng' },
  { id: 'truck', label: 'Giao hàng / Vận chuyển' },
  { id: 'clipboard-check', label: 'Bàn giao kỹ thuật' },
  { id: 'award', label: 'Chất lượng / Giải thưởng' },
  { id: 'wrench', label: 'Bảo trì / Lắp đặt' },
] as const;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  company: {
    name: 'AXIOM Industrial Supply',
    tagline:
      'Đối tác kỹ thuật cung ứng thiết bị công nghiệp nặng, máy CNC và dụng cụ cơ khí chính xác cho các nhà máy sản xuất cơ khí, ô tô, điện tử và hàng không tại Việt Nam.',
    hotline_display: '0988.123.456',
    hotline_tel: '0988123456',
    hotline_note: '24/7',
    email: 'sales@axiom.vn',
    address: 'Lô E2, Khu Công Nghiệp Tân Bình, TP. Hồ Chí Minh',
    zalo_url: 'https://zalo.me',
    zalo_label: 'Axiom Supply',
    copyright: '© 2026 AXIOM Industrial Supply. Tất cả các quyền được bảo lưu.',
    footer_badge: 'ISO 9001 • Chứng Nhận CO/CQ Chính Hãng',
  },
  hero: {
    eyebrow: 'CUNG ỨNG THIẾT BỊ CHO DÂY CHUYỀN SẢN XUẤT CÔNG NGHIỆP',
    title: 'Nhà Cung Cấp Máy Móc Công Nghiệp & Dụng Cụ Cơ Khí Chính Xác',
    subtitle:
      'Duy trì sản xuất liên tục. Cung cấp máy móc tin cậy, dụng cụ chính xác và phụ tùng thay thế từ một đối tác kỹ thuật duy nhất.',
    badges: [
      { icon: 'shield-check', text: 'Chứng Nhận CO/CQ' },
      { icon: 'package-check', text: 'Hàng Có Sẵn Trong Kho' },
    ],
    audience_note: 'Dành cho bộ phận mua hàng, xưởng cơ khí & nhà máy sản xuất.',
    image_url: '/assets/images/cnc-machinery.png',
    caption_left: 'GIA CÔNG • DỤNG CỤ • ĐO LƯỜNG',
    caption_right: 'ISO 9001 / CO-CQ',
    slides: [
      {
        image_url: '/assets/images/cnc-machinery.png',
        caption_left: 'GIA CÔNG • DỤNG CỤ • ĐO LƯỜNG',
        caption_right: 'ISO 9001 / CO-CQ',
      },
      {
        image_url: '/assets/images/cat-cnc.png',
        caption_left: 'MÁY CNC & MÁY CÔNG CỤ CHÍNH XÁC',
        caption_right: 'KHO SẴN HÀNG',
      },
      {
        image_url: '/assets/images/warehouse.png',
        caption_left: 'KHO VẬN CÔNG NGHIỆP AXIOM',
        caption_right: 'GIAO HÀNG 24-48H',
      },
    ],
  },
  trust_stats: {
    items: [
      { icon: 'factory', value: '10+', label: 'Năm Kinh Nghiệm' },
      { icon: 'boxes', value: '1.000+', label: 'SKU Có Sẵn' },
      { icon: 'check-circle', value: '100%', label: 'CO/CQ Chính Hãng' },
      { icon: 'truck', value: '24-48h', label: 'Giao Hàng Toàn Quốc' },
    ],
  },
  capabilities: {
    eyebrow: '03 / KHO HÀNG & NĂNG LỰC CUNG ỨNG',
    title: 'Hơn cả cung ứng. Một đối tác kỹ thuật.',
    description:
      'Từ việc khớp thông số kỹ thuật đến hỗ trợ lắp đặt ban đầu, chúng tôi giúp bộ phận mua hàng và kỹ thuật của bạn phối hợp nhịp nhàng.',
    image_url: '/assets/images/warehouse.png',
    image_caption: 'Kho hàng được tổ chức khoa học. Sẵn sàng xuất kho.',
    items: [
      {
        icon: 'clipboard-check',
        title: 'Hỗ trợ kỹ thuật khi bàn giao',
        desc: 'Kiểm tra ứng dụng, hướng dẫn lắp đặt và tài liệu kèm theo khi bàn giao.',
      },
      {
        icon: 'shield-check',
        title: 'Chính sách bảo hành minh bạch',
        desc: 'Điều khoản bằng văn bản cho từng sản phẩm, có đầu mối hỗ trợ sau bán hàng.',
      },
      {
        icon: 'truck',
        title: 'Giao Hàng Theo Lịch Sản Xuất Của Bạn',
        desc: 'Xác nhận tồn kho, đóng gói cẩn thận và phối hợp giao hàng theo yêu cầu.',
      },
    ],
  },
  product_detail: {
    discount_note: 'Chiết khấu 5% - 15% cho đơn hàng dự án & số lượng lớn',
    vat_note: 'VAT 8% - 10% đầy đủ',
    invoice_note: 'Hóa đơn điện tử xuất trong ngày',
    guarantees: [
      'Bảo hành chính hãng 12-24T',
      'Đổi trả nếu sai dung sai',
      'Kỹ sư hỗ trợ lắp đặt / test',
    ],
    highlights: [
      'Dung sai đồng đều, gia công chính xác theo chuẩn ISO.',
      'Độ cứng bề mặt vượt trội, kéo dài tuổi thọ sử dụng.',
      'Tương thích chuẩn công nghiệp quốc tế (JIS, DIN, ANSI).',
      'Kháng rung động và tản nhiệt tối ưu trong ca vận hành liên tục.',
    ],
    packaging: [
      'Hộp bảo vệ chống ẩm, chống sốc và chống gỉ sét VCI.',
      'Kèm tem mã vạch truy xuất nguồn gốc SKU chính hãng.',
      'Chứng thư kiểm định (Inspection Certificate) kèm theo hộp.',
      'Tài liệu hướng dẫn vận hành và bảo trì máy.',
    ],
    default_certificates: [
      'CO/CQ Gốc Nhà Sản Xuất',
      'Chứng Nhận Chất Lượng Xuất Xưởng ISO 9001:2015',
      'Kiểm Định Dung Sai KCS AXIOM',
    ],
  },
};
