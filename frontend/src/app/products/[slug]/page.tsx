import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import type { Product, ProductDetailResponse } from '@/lib/types';
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

const FALLBACK_DETAIL_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    sku: 'AX-CNC-VMC850',
    name: 'Trung Tâm Gia Công Đứng CNC VMC-850',
    slug: 'trung-tam-gia-cong-dung-cnc-vmc-850-ax-cnc-vmc850',
    brand: 'Axiom Precision',
    image_url: '/assets/images/products/sample-1.png',
    images: ['/assets/images/products/sample-1.png', '/assets/images/products/sample-2.png', '/assets/images/products/sample-3.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng', 'Chứng Nhận Hợp Chuẩn CE Directive', 'Biên Bản Kiểm Định KCS AXIOM'],
    description: 'Trung Tâm Gia Công Đứng CNC VMC-850 là thiết bị cơ khí chính xác được nhập khẩu và phân phối chính thức bởi AXIOM Industrial Supply. Sản phẩm trải qua quy trình kiểm tra chất lượng nghiêm ngặt (KCS), đạt dung sai tối ưu, có đầy đủ hồ sơ CO/CQ và hóa đơn VAT. Phù hợp cho các xưởng gia công CNC, phân xưởng cơ khí chính xác và dây chuyền lắp ráp công nghiệp.',
    specifications: {
      'Hành trình X/Y/Z': '800x500x550 mm',
      'Tốc độ trục chính': '10.000 RPM',
      'Côn trục chính': 'BT40',
      'Hệ điều khiển': 'Fanuc 0i-MF Plus',
      'Độ lặp lại': '±0.003 mm',
    },
    spec_summary: 'Hành trình 800x500x550 mm, 10.000 RPM BT40',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 1,
      name: 'Máy CNC & Máy Công Cụ',
      slug: 'may-cnc-va-may-cong-cu',
      order: 1,
      description: null,
      icon: 'factory',
    },
  },
  {
    id: 10,
    category_id: 2,
    sku: 'AX-EM-4FL-10',
    name: 'Dao Phay Ngón Hợp Kim 4 Me Ø10mm Phủ TiAlN',
    slug: 'dao-phay-ngon-hop-kim-4-me-o10mm-phu-tialn-ax-em-4fl-10',
    brand: 'Axiom Tooling',
    image_url: '/assets/images/products/sample-2.png',
    images: ['/assets/images/products/sample-2.png', '/assets/images/products/sample-5.png', '/assets/images/products/sample-8.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng', 'Biên Bản Kiểm Định KCS AXIOM'],
    description: 'Dao Phay Ngón Hợp Kim 4 Me Ø10mm Phủ TiAlN là dụng cụ cắt gọt cao cấp từ Axiom Tooling, tối ưu cho gia công phay biên dạng thép hợp kim độ cứng cao đến 55 HRC.',
    specifications: {
      'Đường kính cán': 'Ø10 mm',
      'Độ cứng gia công': 'Lên đến 55 HRC',
      'Góc xoắn': '35 độ',
      'Lớp phủ': 'AlTiN Nano-structure',
    },
    spec_summary: 'Đường kính Ø10 mm, 4 me phủ TiAlN (55 HRC)',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 2,
      name: 'Dụng Cụ Cắt Gọt',
      slug: 'dung-cu-cat-got',
      order: 2,
      description: null,
      icon: 'crosshair',
    },
  },
  {
    id: 19,
    category_id: 3,
    sku: 'AX-PM-150',
    name: 'Thước Kẹp Điện Tử Đo Trong Ngoài 0-150mm IP67',
    slug: 'thuoc-kep-dien-tu-do-trong-ngoai-0-150mm-ip67-ax-pm-150',
    brand: 'Mitutoyo',
    image_url: '/assets/images/products/sample-3.png',
    images: ['/assets/images/products/sample-3.png', '/assets/images/products/sample-6.png', '/assets/images/products/sample-9.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'JIS B 7507 Tiêu Chuẩn Công Nghiệp Nhật', 'Kiểm Định Dung Sai KCS AXIOM'],
    description: 'Thước Kẹp Điện Tử Đo Trong Ngoài 0-150mm IP67 từ Mitutoyo Nhật Bản, chống dầu nước chuẩn IP67, cho kết quả đo tin cậy tuyệt đối tại xưởng cơ khí.',
    specifications: {
      'Phạm vi đo': '0 – 150 mm (0 - 6 inch)',
      'Độ phân giải': '0.01 mm (0.0005 inch)',
      'Độ chính xác': '±0.02 mm',
      'Tiêu chuẩn bảo vệ': 'Chống nước kháng dầu IP67',
    },
    spec_summary: 'Phạm vi đo 0–150 mm, IP67 kháng nước',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 3,
      name: 'Dụng Cụ Đo Lường Chính Xác',
      slug: 'do-luong-chinh-xac',
      order: 3,
      description: null,
      icon: 'scan-line',
    },
  },
  {
    id: 28,
    category_id: 4,
    sku: 'AX-WH-100',
    name: 'Ê Tô Máy Phay Cơ Khí Thủy Lực Lực Kẹp Khỏe VH-100',
    slug: 'e-to-may-phay-co-khi-thuy-luc-luc-kep-khoe-vh-100-ax-wh-100',
    brand: 'Vertex',
    image_url: '/assets/images/products/sample-4.png',
    images: ['/assets/images/products/sample-4.png', '/assets/images/products/sample-7.png', '/assets/images/products/sample-1.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng', 'Kiểm Định Dung Sai KCS AXIOM'],
    description: 'Ê Tô Máy Phay Cơ Khí Thủy Lực VH-100 Vertex chuyên dụng cho máy phay đứng, máy phay CNC. Thân gang đúc liền khối chịu lực kẹp lớn 2500 kgf không biến dạng.',
    specifications: {
      'Chiều rộng hàm kẹp': '100 mm',
      'Độ mở hàm max': '170 mm',
      'Lực kẹp thủy lực': '2500 kgf',
      'Độ song song': '0.01 mm / 100mm',
    },
    spec_summary: 'Chiều rộng hàm kẹp 100 mm, mở 170 mm',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 4,
      name: 'Gá Đặt & Phụ Kiện Máy',
      slug: 'ga-dat-va-phu-kien-may',
      order: 4,
      description: null,
      icon: 'boxes',
    },
  },
  {
    id: 37,
    category_id: 5,
    sku: 'AX-BR-6205-2RS',
    name: 'Vòng Bi Bạc Đạn Cầu Rãnh Sâu 6205-2RS Nắp Cao Su',
    slug: 'vong-bi-bac-dan-cau-ranh-sau-6205-2rs-nap-cao-su-ax-br-6205-2rs',
    brand: 'SKF',
    image_url: '/assets/images/products/sample-5.png',
    images: ['/assets/images/products/sample-5.png', '/assets/images/products/sample-8.png', '/assets/images/products/sample-2.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng', 'Chứng Nhận Hợp Chuẩn CE Directive'],
    description: 'Vòng Bi Bạc Đạn Cầu Rãnh Sâu 6205-2RS thương hiệu SKF chính hãng, trang bị hai nắp chắn cao su NBR chống bụi bẩn và rò rỉ mỡ bôi trơn hiệu quả cao.',
    specifications: {
      'Đường kính trong (d)': '25 mm',
      'Đường kính ngoài (D)': '52 mm',
      'Độ dày (B)': '15 mm',
      'Vật liệu con lăn': 'Thép vòng bi 100Cr6',
    },
    spec_summary: '25 x 52 x 15 mm, hai nắp cao su NBR',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 5,
      name: 'Bạc Đạn & Truyền Động Tuyến Tính',
      slug: 'bac-dan-va-truyen-dong',
      order: 5,
      description: null,
      icon: 'crosshair',
    },
  },
  {
    id: 46,
    category_id: 6,
    sku: 'AX-LUB-EMUL20L',
    name: 'Dầu Làm Mát Cắt Gọt Kim Loại Pha Nước Bán Tổng Hợp Thùng 20L',
    slug: 'dau-lam-mat-cat-got-kim-loai-pha-nuoc-ban-tong-hop-thung-20l-ax-lub-emul20l',
    brand: 'Castrol Hysol',
    image_url: '/assets/images/products/sample-6.png',
    images: ['/assets/images/products/sample-6.png', '/assets/images/products/sample-9.png', '/assets/images/products/sample-3.png'],
    certificates: ['CO/CQ Gốc Nhà Máy', 'Bảng Chỉ Dẫn An Toàn Hóa Chất MSDS', 'Biên Bản Kiểm Định KCS AXIOM'],
    description: 'Dầu làm mát cắt gọt kim loại pha nước Castrol Hysol thùng 20L, khả năng bôi trơn và tản nhiệt tối ưu, chống vi sinh lên men và chống gỉ phôi vượt trội.',
    specifications: {
      'Quy cách bao bì': 'Thùng 20 Lít',
      'Tỷ lệ pha khuyến nghị': '5% - 8% với nước sạch',
      'Độ pH dung dịch': '8.8 - 9.3',
      'Tính năng': 'Không chứa clo, kháng bọt tốt',
    },
    spec_summary: 'Xô 20 Lít, tỷ lệ pha 5–8% chống gỉ tốt',
    stock_status: 'in_stock',
    price_display: 'Liên hệ báo giá',
    has_cocq: true,
    is_featured: true,
    category: {
      id: 6,
      name: 'Bôi Trơn & Khí Nén',
      slug: 'boi-tron-va-khi-nen',
      order: 6,
      description: null,
      icon: 'truck',
    },
  },
];

function getFallbackProductDetail(identifier: string): ProductDetailResponse | null {
  if (!identifier) return null;
  const normalized = decodeURIComponent(identifier).trim().toLowerCase();

  const found = FALLBACK_DETAIL_PRODUCTS.find((p) => {
    return (
      p.slug.toLowerCase() === normalized ||
      p.sku.toLowerCase() === normalized ||
      p.category?.slug.toLowerCase() === normalized ||
      normalized.includes(p.sku.toLowerCase()) ||
      p.slug.toLowerCase().includes(normalized)
    );
  });

  const selectedProduct = found || FALLBACK_DETAIL_PRODUCTS[0];
  const relatedProducts = FALLBACK_DETAIL_PRODUCTS.filter((p) => p.sku !== selectedProduct.sku).slice(0, 4);

  return {
    success: true,
    data: selectedProduct,
    related_products: relatedProducts,
  };
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

    const resolvedData = productRes?.data || getFallbackProductDetail(slug)?.data;

    if (!resolvedData) {
      return {
        title: 'Chi Tiết Sản Phẩm | AXIOM',
        description: 'Xem thông số kỹ thuật và báo giá thiết bị công nghiệp chính hãng tại AXIOM.',
        robots: { index: false, follow: false },
      };
    }

    return buildProductMetadata(resolvedData, siteSettings || DEFAULT_SITE_SETTINGS);
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

  const resolvedRes = productRes?.data ? productRes : getFallbackProductDetail(slug);

  if (!resolvedRes?.data) {
    notFound();
  }

  const product = resolvedRes.data;
  const relatedProducts = Array.isArray(resolvedRes.related_products)
    ? resolvedRes.related_products
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
