import React from 'react';
import Image from 'next/image';
import { PackageCheck, ClipboardCheck, ShieldCheck, Truck } from 'lucide-react';

export default function WarehouseCapabilities() {
  const capabilities = [
    {
      title: 'Hỗ trợ kỹ thuật khi bàn giao',
      desc: 'Kiểm tra ứng dụng, hướng dẫn lắp đặt và tài liệu kèm theo khi bàn giao.',
      icon: ClipboardCheck,
    },
    {
      title: 'Chính sách bảo hành minh bạch',
      desc: 'Điều khoản bằng văn bản cho từng sản phẩm, có đầu mối hỗ trợ sau bán hàng.',
      icon: ShieldCheck,
    },
    {
      title: 'Giao Hàng Theo Lịch Sản Xuất Của Bạn',
      desc: 'Xác nhận tồn kho, đóng gói cẩn thận và phối hợp giao hàng theo yêu cầu.',
      icon: Truck,
    },
  ];

  return (
    <section id="capabilities" className="bg-surface py-16 lg:py-24 border-b border-line">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center gap-12 lg:gap-[72px]">
        {/* Left column: Warehouse Photography */}
        <div className="flex-1 w-full max-w-[612px]">
          <div className="relative h-[340px] sm:h-[420px] rounded-[8px] overflow-hidden border border-line shadow-axiom-card">
            <Image
              src="/assets/images/warehouse.png"
              alt="Kho hàng thiết bị công nghiệp AXIOM"
              fill
              className="object-cover"
            />
            {/* Caption badge */}
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-navy-900/95 text-white px-4 py-3 rounded-[4px] flex items-center gap-2.5 shadow-md">
              <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-[13px] font-medium">
                Kho hàng được tổ chức khoa học. Sẵn sàng xuất kho.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Supply Capabilities Details */}
        <div className="flex-1 max-w-[620px] flex flex-col gap-5">
          <span className="text-ink-muted text-[12px] font-semibold tracking-[1.4px] uppercase">
            03 / KHO HÀNG &amp; NĂNG LỰC CUNG ỨNG
          </span>

          <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-[-0.03em] leading-[1.15]">
            Hơn cả cung ứng. <br className="hidden sm:inline" />Một đối tác kỹ thuật.
          </h2>

          <p className="text-ink-muted text-[14px] leading-[1.6]">
            Từ việc khớp thông số kỹ thuật đến hỗ trợ lắp đặt ban đầu, chúng tôi giúp bộ phận mua hàng và kỹ thuật của bạn phối hợp nhịp nhàng.
          </p>

          <div className="flex flex-col gap-4 pt-2">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-[4px] bg-canvas border border-line flex items-center justify-center text-navy-900 shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-navy-900" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[15px] font-semibold text-ink">{cap.title}</h3>
                    <p className="text-ink-muted text-[13px] leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
