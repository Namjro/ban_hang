'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, FileDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface QuickSpecTableProps {
  onOpenQuoteModal?: () => void;
}

export default function QuickSpecTable({ onOpenQuoteModal }: QuickSpecTableProps) {
  const toast = useToast();

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

  const handleRequestSpecSheet = (sku: string) => {
    toast.info(
      `Tài liệu Spec Sheet cho mã ${sku} được gửi kèm báo giá kỹ thuật. Vui lòng để lại email để nhận bản PDF chính thức.`,
      'Yêu cầu Spec Sheet'
    );
    onOpenQuoteModal?.();
  };

  return (
    <section id="quick-specs" className="bg-canvas py-16 lg:py-24 border-b border-line">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] flex flex-col gap-7">
        {/* Specification Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-ink-muted text-[12px] font-semibold tracking-[1.4px] uppercase">
              02 / TÀI LIỆU KỸ THUẬT THAM KHẢO
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-[-0.03em]">
              Ít tra cứu hơn. Chắc chắn hơn.
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface border border-line px-3 py-2 rounded-[4px] shadow-axiom-card">
            <FileText className="w-4 h-4 text-ink-muted" aria-hidden="true" />
            <span className="text-[12px] text-ink-muted font-medium">
              Bảng Thông Số Nhanh / Danh mục mẫu
            </span>
          </div>
        </div>

        {/* Specification Comparison Table */}
        <div className="border border-line rounded-[8px] overflow-hidden bg-surface shadow-axiom-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-navy-900 text-white text-[12px] font-semibold tracking-[0.5px] uppercase">
                <th className="py-4 px-6 w-[180px]">MÃ SKU</th>
                <th className="py-4 px-6">Danh Mục</th>
                <th className="py-4 px-6 w-[320px]">Kích Thước / Thông Số</th>
                <th className="py-4 px-6 w-[160px]">Thương Hiệu</th>
                <th className="py-4 px-6 w-[90px] text-center">Tài Liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {specs.map((row, idx) => (
                <tr key={idx} className="hover:bg-canvas transition-colors text-[13px]">
                  <td className="py-4 px-6 font-semibold text-ink font-mono">
                    <Link
                      href={`/products/${row.sku}`}
                      className="hover:text-amber-600 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{row.sku}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-ink-dim" aria-hidden="true" />
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <Link
                        href={`/products/${row.sku}`}
                        className="font-semibold text-ink hover:text-amber-600 text-[14px] transition-colors"
                      >
                        {row.category}
                      </Link>
                      <span className="text-ink-muted text-[12px]">{row.group}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-ink-muted leading-relaxed">{row.dimensions}</td>
                  <td className="py-4 px-6 font-semibold text-ink">{row.brand}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleRequestSpecSheet(row.sku)}
                      aria-label={`Nhận Spec Sheet cho ${row.sku}`}
                      title={`Nhận Spec Sheet ${row.sku}`}
                      className="min-w-[44px] min-h-[44px] hover:bg-line/50 rounded-[4px] text-ink transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      <FileDown className="w-5 h-5 text-ink" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Technical Disclaimer */}
        <p className="text-ink-muted text-[12px] leading-[1.6]">
          Mã SKU và kích thước chỉ mang tính minh họa—không phải thông số kỹ thuật đã được nhà sản xuất xác nhận. Vui lòng xác nhận model, kích thước và tài liệu kỹ thuật chính thức với bộ phận kỹ thuật của chúng tôi trước khi đặt hàng.
        </p>

        {/* Action */}
        <div className="flex items-center justify-end w-full pt-1">
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink hover:text-amber-600 transition-colors min-h-[44px] px-2 cursor-pointer"
          >
            <span>Yêu cầu tài liệu kỹ thuật đầy đủ</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
