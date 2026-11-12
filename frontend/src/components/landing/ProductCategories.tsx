import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProductCategories() {
  const categories = [
    {
      sub: 'GIA CÔNG CƠ KHÍ',
      title: 'Máy CNC & Máy Công Cụ',
      line1Title: 'Thiết Bị',
      line1Val: 'Tiện, Phay, Cưa vòng, Mài phẳng',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Tải trọng • Trục • Công suất',
      image: '/assets/images/cat-cnc.png',
      slug: 'may-cnc-va-may-cong-cu',
    },
    {
      sub: 'DỤNG CỤ CẮT GỌT',
      title: 'Dụng Cụ Cắt Gọt',
      line1Title: 'Dòng Sản Phẩm',
      line1Val: 'Mảnh hợp kim, Dao phay ngón, Mũi khoan',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Vật liệu • Đường kính • Lớp phủ',
      image: '/assets/images/cat-cutting.png',
      slug: 'dung-cu-cat-got',
    },
    {
      sub: 'ĐO LƯỜNG CHÍNH XÁC',
      title: 'Dụng Cụ Đo Lường Chính Xác',
      line1Title: 'Thiết Bị Đo',
      line1Val: 'Thước kẹp, Panme, Đồng hồ so',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Phạm vi đo • Độ phân giải • Độ chính xác',
      image: '/assets/images/cat-measuring.png',
      slug: 'do-luong-chinh-xac',
    },
    {
      sub: 'GÁ ĐẶT & ĐỒ GÁ',
      title: 'Gá Đặt & Phụ Kiện Máy',
      line1Title: 'Phụ Kiện',
      line1Val: 'Ê tô thủy lực, Bầu kẹp BT40, Mâm cặp',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Lực kẹp • Chuẩn côn • Khả năng gá',
      image: '/assets/images/cat-fixture.png',
      slug: 'ga-dat-va-phu-kien-may',
    },
    {
      sub: 'TRUYỀN ĐỘNG CƠ KHÍ',
      title: 'Bạc Đạn & Truyền Động Tuyến Tính',
      line1Title: 'Sản Phẩm',
      line1Val: 'Vòng bi cầu, Bạc đạn đỡ chặn, Ray trượt',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Đường kính trục • Tải trọng • Cấp chính xác',
      image: '/assets/images/cat-bearing.png',
      slug: 'bac-dan-va-truyen-dong',
    },
    {
      sub: 'VẬT TƯ TIÊU HAO',
      title: 'Bôi Trơn & Khí Nén',
      line1Title: 'Dung Dịch & Thiết Bị',
      line1Val: 'Dầu tưới nguội pha nước, Bộ lọc khí, Van SMC',
      line2Title: 'Lựa Chọn Theo',
      line2Val: 'Độ nhớt • Tỷ lệ pha • Áp suất làm việc',
      image: '/assets/images/cat-pneumatic.png',
      slug: 'boi-tron-va-khi-nen',
    },
  ];

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
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-surface border border-line rounded-[8px] overflow-hidden flex flex-col hover:border-navy-900 transition-colors duration-200 group shadow-axiom-card hover:shadow-md"
            >
              {/* Product Media */}
              <div className="bg-canvas h-[204px] relative overflow-hidden flex items-center justify-center p-4 border-b border-line">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Information */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-ink-muted text-[12px] font-semibold tracking-[1px] uppercase">
                    {cat.sub}
                  </span>
                  <h3 className="text-[20px] font-bold text-ink tracking-[-0.02em] min-h-[48px] line-clamp-2">
                    {cat.title}
                  </h3>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <div className="flex flex-col">
                      <span className="text-ink-dim text-[12px]">{cat.line1Title}</span>
                      <span className="text-ink text-[13px] font-medium">{cat.line1Val}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-ink-dim text-[12px]">{cat.line2Title}</span>
                      <span className="text-ink text-[13px] font-medium">{cat.line2Val}</span>
                    </div>
                  </div>
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
          ))}
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
