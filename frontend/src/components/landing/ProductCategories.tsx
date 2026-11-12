'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Category } from '@/lib/types';

interface ProductCategoriesProps {
  categories?: Category[];
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Máy CNC & Máy Công Cụ',
    subtitle: 'GIA CÔNG CƠ KHÍ',
    slug: 'may-cnc-va-may-cong-cu',
    description: null,
    icon: 'factory',
    image_url: '/assets/images/cat-cnc.png',
    highlights: [
      { label: 'Thiết Bị', value: 'Tiện, Phay, Cưa vòng, Mài phẳng' },
      { label: 'Lựa Chọn Theo', value: 'Tải trọng • Trục • Công suất' },
    ],
    show_on_home: true,
    order: 1,
  },
  {
    id: 2,
    name: 'Dụng Cụ Cắt Gọt',
    subtitle: 'DỤNG CỤ CẮT GỌT',
    slug: 'dung-cu-cat-got',
    description: null,
    icon: 'crosshair',
    image_url: '/assets/images/cat-cutting.png',
    highlights: [
      { label: 'Dòng Sản Phẩm', value: 'Mảnh hợp kim, Dao phay ngón, Mũi khoan' },
      { label: 'Lựa Chọn Theo', value: 'Vật liệu • Đường kính • Lớp phủ' },
    ],
    show_on_home: true,
    order: 2,
  },
  {
    id: 3,
    name: 'Dụng Cụ Đo Lường Chính Xác',
    subtitle: 'ĐO LƯỜNG CHÍNH XÁC',
    slug: 'do-luong-chinh-xac',
    description: null,
    icon: 'scan-line',
    image_url: '/assets/images/cat-measuring.png',
    highlights: [
      { label: 'Thiết Bị Đo', value: 'Thước kẹp, Panme, Đồng hồ so' },
      { label: 'Lựa Chọn Theo', value: 'Phạm vi đo • Độ phân giải • Độ chính xác' },
    ],
    show_on_home: true,
    order: 3,
  },
  {
    id: 4,
    name: 'Gá Đặt & Phụ Kiện Máy',
    subtitle: 'GÁ ĐẶT & ĐỒ GÁ',
    slug: 'ga-dat-va-phu-kien-may',
    description: null,
    icon: 'boxes',
    image_url: '/assets/images/cat-fixture.png',
    highlights: [
      { label: 'Phụ Kiện', value: 'Ê tô thủy lực, Bầu kẹp BT40, Mâm cặp' },
      { label: 'Lựa Chọn Theo', value: 'Lực kẹp • Chuẩn côn • Khả năng gá' },
    ],
    show_on_home: true,
    order: 4,
  },
  {
    id: 5,
    name: 'Bạc Đạn & Truyền Động Tuyến Tính',
    subtitle: 'TRUYỀN ĐỘNG CƠ KHÍ',
    slug: 'bac-dan-va-truyen-dong',
    description: null,
    icon: 'crosshair',
    image_url: '/assets/images/cat-bearing.png',
    highlights: [
      { label: 'Sản Phẩm', value: 'Vòng bi cầu, Bạc đạn đỡ chặn, Ray trượt' },
      { label: 'Lựa Chọn Theo', value: 'Đường kính trục • Tải trọng • Cấp chính xác' },
    ],
    show_on_home: true,
    order: 5,
  },
  {
    id: 6,
    name: 'Bôi Trơn & Khí Nén',
    subtitle: 'VẬT TƯ TIÊU HAO',
    slug: 'boi-tron-va-khi-nen',
    description: null,
    icon: 'truck',
    image_url: '/assets/images/cat-pneumatic.png',
    highlights: [
      { label: 'Dung Dịch & Thiết Bị', value: 'Dầu tưới nguội pha nước, Bộ lọc khí, Van SMC' },
      { label: 'Lựa Chọn Theo', value: 'Độ nhớt • Tỷ lệ pha • Áp suất làm việc' },
    ],
    show_on_home: true,
    order: 6,
  },
];

export default function ProductCategories({ categories }: ProductCategoriesProps) {
  const items = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="bg-surface py-16 lg:py-24 border-b border-line">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10">
          <div className="flex flex-col gap-3 max-w-[700px]">
            <span className="text-ink-muted text-[12px] font-semibold tracking-[1.4px] uppercase">
              01 / DANH MỤC SẢN PHẨM
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-[-0.03em] leading-[1.2]">
              Thiết bị phù hợp. Cho mọi quy trình sản xuất.
            </h2>
          </div>
          <p className="text-ink-muted text-[14px] leading-[1.6] max-w-[390px]">
            Từ bước gia công đầu tiên đến kiểm tra cuối cùng, tìm ngay dụng cụ giúp bạn giữ dung sai chính xác và dây chuyền vận hành liên tục.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cat) => {
            const imgSrc = cat.image_url || '/assets/images/cat-cnc.png';
            const highlights =
              cat.highlights && cat.highlights.length > 0
                ? cat.highlights
                : cat.description
                  ? [{ label: 'Mô tả', value: cat.description }]
                  : [];

            return (
              <div
                key={cat.id ?? cat.slug}
                className="bg-surface border border-line rounded-[8px] overflow-hidden flex flex-col hover:border-navy-900 transition-colors duration-200 group shadow-axiom-card hover:shadow-md"
              >
                {/* Product Media */}
                <div className="bg-canvas h-[204px] relative overflow-hidden flex items-center justify-center p-4 border-b border-line">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    unoptimized={imgSrc.startsWith('http')}
                    className="object-cover"
                  />
                </div>

                {/* Information */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-ink-muted text-[12px] font-semibold tracking-[1px] uppercase">
                      {cat.subtitle || 'DANH MỤC THIẾT BỊ'}
                    </span>
                    <h3 className="text-[20px] font-bold text-ink tracking-[-0.02em] min-h-[48px] line-clamp-2">
                      {cat.name}
                    </h3>

                    {highlights.length > 0 && (
                      <div className="flex flex-col gap-2.5 pt-2">
                        {highlights.map((hl, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-ink-dim text-[12px]">{hl.label}</span>
                            <span className="text-ink text-[13px] font-medium line-clamp-2">
                              {hl.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Details Action */}
                  <Button
                    href={`/products?category=${cat.slug}`}
                    variant="secondary"
                    size="lg"
                    className="w-full hover:bg-navy-900 hover:text-white hover:border-navy-900"
                  >
                    <span>Xem Chi Tiết</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sourcing assistance bar */}
        <div className="pt-8 border-t border-line mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px]">
          <p className="text-ink-muted text-center sm:text-left">
            Chưa tìm thấy phụ tùng phù hợp? Gửi bản vẽ, mã SKU hoặc yêu cầu kỹ thuật.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-amber-600 transition-colors shrink-0 group min-h-[44px]"
          >
            <span>Xem thêm sản phẩm</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
