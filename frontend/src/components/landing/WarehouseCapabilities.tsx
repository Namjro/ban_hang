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
    <section id="capabilities" className="bg-white py-16 lg:py-[80px] border-b border-[#dce2ea]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col lg:flex-row items-center gap-12 lg:gap-[72px]">
        {/* Left column: Warehouse Photography */}
        <div className="flex-1 w-full max-w-[612px]">
          <div className="relative h-[360px] sm:h-[430px] rounded-[8px] overflow-hidden border border-[#dce2ea] shadow-xs">
            <Image
              src="/assets/images/warehouse.png"
              alt="Kho hàng thiết bị công nghiệp AXIOM"
              fill
              className="object-cover"
            />
            {/* Caption badge */}
            <div className="absolute bottom-5 left-5 bg-[#0b132b]/95 backdrop-blur-xs text-white px-4 py-3 rounded-[4px] flex items-center gap-2.5 shadow-md">
              <PackageCheck className="w-4 h-4 text-[#10b981] shrink-0" />
              <span className="text-[12px] font-medium">
                Kho hàng được tổ chức khoa học. Sẵn sàng xuất kho.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Supply Capabilities Details */}
        <div className="flex-1 max-w-[620px] flex flex-col gap-5">
          <span className="text-[#475569] text-[11px] font-semibold tracking-[1.6px] uppercase">
            03 / KHO HÀNG & NĂNG LỰC CUNG ỨNG
          </span>

          <h2 className="text-[30px] sm:text-[36px] font-bold text-[#0b132b] tracking-[-1.3px] leading-[1.15]">
            Hơn cả cung ứng. <br className="hidden sm:inline" />Một đối tác kỹ thuật.
          </h2>

          <p className="text-[#475569] text-[14px] leading-[1.6]">
            Từ việc khớp thông số kỹ thuật đến hỗ trợ lắp đặt ban đầu, chúng tôi giúp bộ phận mua hàng và kỹ thuật của bạn phối hợp nhịp nhàng.
          </p>

          <div className="flex flex-col gap-4 pt-2">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-[4px] bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#0b132b]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[14px] font-semibold text-[#0b132b]">
                      {cap.title}
                    </h4>
                    <p className="text-[#475569] text-[13px] leading-relaxed">
                      {cap.desc}
                    </p>
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
