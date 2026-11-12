'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, FileDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/lib/types';
import { productService } from '@/services';

interface QuickSpecTableProps {
  onOpenQuoteModal?: () => void;
}

interface QuickSpecRow {
  sku: string;
  slug: string;
  name: string;
  group: string;
  dimensions: string;
  brand: string;
  datasheetUrl?: string | null;
}

const FALLBACK_SPECS: QuickSpecRow[] = [
  {
    sku: 'AX-WH-100',
    slug: 'AX-WH-100',
    name: 'Ê tô máy',
    group: 'Kẹp Gá & Đồ Gá Định Vị',
    dimensions: 'Chiều rộng hàm kẹp 100 mm, mở 170 mm',
    brand: 'Vertex',
  },
  {
    sku: 'AX-PM-150',
    slug: 'AX-PM-150',
    name: 'Thước kẹp điện tử',
    group: 'Đo Lường Chính Xác',
    dimensions: 'Phạm vi đo 0–150 mm, IP67 kháng nước',
    brand: 'Mitutoyo',
  },
  {
    sku: 'AX-EM-4FL-10',
    slug: 'AX-EM-4FL-10',
    name: 'Dao phay ngón carbide',
    group: 'Dụng Cụ Cắt Gọt',
    dimensions: 'Đường kính Ø10 mm, 4 me phủ TiAlN (55 HRC)',
    brand: 'Axiom Tooling',
  },
  {
    sku: 'AX-BR-6205-2RS',
    slug: 'AX-BR-6205-2RS',
    name: 'Vòng bi cầu rãnh sâu',
    group: 'Bạc Đạn & Truyền Động',
    dimensions: '25 x 52 x 15 mm, hai nắp cao su NBR',
    brand: 'SKF',
  },
  {
    sku: 'AX-CNC-VMC850',
    slug: 'AX-CNC-VMC850',
    name: 'Trung tâm phay đứng CNC',
    group: 'Máy CNC & Máy Công Cụ',
    dimensions: 'Hành trình 800x500x550 mm, 10.000 RPM BT40',
    brand: 'Axiom Precision',
  },
  {
    sku: 'AX-LUB-EMUL20L',
    slug: 'AX-LUB-EMUL20L',
    name: 'Dầu làm mát pha nước',
    group: 'Bôi Trơn & Khí Nén',
    dimensions: 'Xô 20 Lít, tỷ lệ pha 5–8% chống gỉ tốt',
    brand: 'Castrol Hysol',
  },
];

function formatProductRow(p: Product): QuickSpecRow {
  const specText =
    p.spec_summary ||
    (p.specifications
      ? Object.entries(p.specifications)
          .slice(0, 2)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : p.description || '');

  return {
    sku: p.sku,
    slug: p.slug || p.sku,
    name: p.name,
    group: p.category?.name || 'Thiết bị công nghiệp',
    dimensions: specText,
    brand: p.brand,
    datasheetUrl: p.datasheet_url,
  };
}

export default function QuickSpecTable({ onOpenQuoteModal }: QuickSpecTableProps) {
  const toast = useToast();
  const [rows, setRows] = useState<QuickSpecRow[]>(FALLBACK_SPECS);

  useEffect(() => {
    let isMounted = true;
    productService
      .getQuickSpecs()
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setRows(res.data.map(formatProductRow));
        }
      })
      .catch(() => {
        // Keep FALLBACK_SPECS on error
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSpecSheetAction = (row: QuickSpecRow) => {
    if (row.datasheetUrl) {
      window.open(row.datasheetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    toast.info(
      `Tài liệu Spec Sheet cho mã ${row.sku} được gửi kèm báo giá kỹ thuật. Vui lòng để lại email để nhận bản PDF chính thức.`,
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
                <th className="py-4 px-6">Sản Phẩm / Danh Mục</th>
                <th className="py-4 px-6 w-[320px]">Kích Thước / Thông Số</th>
                <th className="py-4 px-6 w-[160px]">Thương Hiệu</th>
                <th className="py-4 px-6 w-[90px] text-center">Tài Liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.sku} className="hover:bg-canvas transition-colors text-[13px]">
                  <td className="py-4 px-6 font-semibold text-ink font-mono">
                    <Link
                      href={`/products/${row.slug}`}
                      className="hover:text-amber-600 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{row.sku}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-ink-dim" aria-hidden="true" />
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <Link
                        href={`/products/${row.slug}`}
                        className="font-semibold text-ink hover:text-amber-600 text-[14px] transition-colors"
                      >
                        {row.name}
                      </Link>
                      <span className="text-ink-muted text-[12px]">{row.group}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-ink-muted leading-relaxed">{row.dimensions}</td>
                  <td className="py-4 px-6 font-semibold text-ink">{row.brand}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleSpecSheetAction(row)}
                      aria-label={
                        row.datasheetUrl
                          ? `Tải Spec Sheet PDF cho ${row.sku}`
                          : `Nhận Spec Sheet cho ${row.sku}`
                      }
                      title={
                        row.datasheetUrl
                          ? `Tải Spec Sheet PDF (${row.sku})`
                          : `Yêu cầu Spec Sheet ${row.sku}`
                      }
                      className="min-w-[44px] min-h-[44px] hover:bg-line/50 rounded-[4px] text-ink transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      <FileDown
                        className={`w-5 h-5 ${row.datasheetUrl ? 'text-amber-600' : 'text-ink'}`}
                        aria-hidden="true"
                      />
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
