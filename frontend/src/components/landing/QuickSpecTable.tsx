'use client';

import React from 'react';
import { FileText, FileDown } from 'lucide-react';

interface QuickSpecTableProps {
  onOpenQuoteModal?: () => void;
}

export default function QuickSpecTable({ onOpenQuoteModal }: QuickSpecTableProps) {
  const specs = [
    {
      sku: 'AX-WH-100',
      category: 'Ê tô máy',
      group: 'Kẹp Gá & Đồ Gá Định Vị',
      dimensions: 'Chiều rộng hàm kẹp 100 mm, mở 170 mm',
      brand: 'Vertex',
    },
    {
      sku: 'AX-PM-150',
      category: 'Thước kẹp điện tử',
      group: 'Đo Lường Chính Xác',
      dimensions: 'Phạm vi đo 0–150 mm, IP67 kháng nước',
      brand: 'Mitutoyo',
    },
    {
      sku: 'AX-EM-4FL-10',
      category: 'Dao phay ngón carbide',
      group: 'Dụng Cụ Cắt Gọt',
      dimensions: 'Đường kính Ø10 mm, 4 me phủ TiAlN (55 HRC)',
      brand: 'Axiom Tooling',
    },
    {
      sku: 'AX-BR-6205-2RS',
      category: 'Vòng bi cầu rãnh sâu',
      group: 'Bạc Đạn & Truyền Động',
      dimensions: '25 x 52 x 15 mm, hai nắp cao su NBR',
      brand: 'SKF',
    },
    {
      sku: 'AX-CNC-VMC850',
      category: 'Trung tâm phay đứng CNC',
      group: 'Máy CNC & Máy Công Cụ',
      dimensions: 'Hành trình 800x500x550 mm, 10.000 RPM BT40',
      brand: 'Axiom Precision',
    },
    {
      sku: 'AX-LUB-EMUL20L',
      category: 'Dầu làm mát pha nước',
      group: 'Bôi Trơn & Khí Nén',
      dimensions: 'Xô 20 Lít, tỷ lệ pha 5–8% chống gỉ tốt',
      brand: 'Castrol Hysol',
    },
  ];

  const handleDownloadSpec = (sku: string) => {
    alert(`Đang tải tài liệu thông số kỹ thuật Spec Sheet cho mã [${sku}] (PDF)...`);
  };

  return (
    <section id="quick-specs" className="bg-[#f8fafc] py-16 lg:py-[80px] border-b border-[#dce2ea]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col gap-7">
        {/* Specification Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-[#475569] text-[11px] font-semibold tracking-[1.6px] uppercase">
              02 / TÀI LIỆU KỸ THUẬT THAM KHẢO
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0b132b] tracking-[-1.3px]">
              Ít tra cứu hơn. Chắc chắn hơn.
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-[#dce2ea] px-3 py-1.5 rounded-[4px] shadow-2xs">
            <FileText className="w-4 h-4 text-[#475569]" />
            <span className="text-[12px] text-[#475569] font-medium">
              Bảng Thông Số Nhanh / Danh mục mẫu
            </span>
          </div>
        </div>

        {/* Specification Comparison Table */}
        <div className="border border-[#dce2ea] rounded-[8px] overflow-hidden bg-white shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#0b132b] text-white text-[11px] font-semibold tracking-[0.6px] uppercase">
                <th className="py-4 px-6 w-[180px]">MÃ SKU</th>
                <th className="py-4 px-6">Danh Mục</th>
                <th className="py-4 px-6 w-[320px]">Kích Thước / Thông Số</th>
                <th className="py-4 px-6 w-[160px]">Thương Hiệu</th>
                <th className="py-4 px-6 w-[70px] text-center">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce2ea]">
              {specs.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#f8fafc] transition-colors text-[13px]"
                >
                  <td className="py-4 px-6 font-semibold text-[#0b132b] font-mono">
                    <a
                      href={`/products/${row.sku}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#d97706] transition-colors inline-flex items-center gap-1 group/link"
                      title="Mở trang chi tiết sản phẩm ở tab mới"
                    >
                      <span>{row.sku}</span>
                      <span className="text-[10px] text-[#94a3b8] group-hover/link:text-[#d97706]">↗</span>
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <a
                        href={`/products/${row.sku}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0b132b] hover:text-[#d97706] text-[14px] transition-colors"
                      >
                        {row.category}
                      </a>
                      <span className="text-[#475569] text-[11px]">
                        {row.group}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#475569] leading-relaxed">
                    {row.dimensions}
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#0b132b]">
                    {row.brand}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDownloadSpec(row.sku)}
                      title={`Tải Spec Sheet ${row.sku}`}
                      className="p-1.5 hover:bg-[#dce2ea] rounded-[4px] text-[#0b132b] transition-colors inline-flex items-center justify-center"
                    >
                      <FileDown className="w-5 h-5 text-[#0b132b]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Technical Disclaimer (Figma Node 3:2724) */}
        <p className="text-[#475569] text-[12px] leading-[1.6]">
          Mã SKU và kích thước chỉ mang tính minh họa—không phải thông số kỹ thuật đã được nhà sản xuất xác nhận. Vui lòng xác nhận model, kích thước và tài liệu kỹ thuật chính thức với bộ phận kỹ thuật của chúng tôi trước khi đặt hàng.
        </p>

        {/* Sourcing assistance / Action (Figma Node 1:2 & 1:4) */}
        <div className="flex items-center justify-end w-full pt-1">
          <button
            onClick={onOpenQuoteModal}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0b132b] hover:text-[#f59e0b] transition-colors group cursor-pointer"
          >
            <span>Xem thêm tài liệu</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
