'use client';

import React, { useState } from 'react';
import { Award, Check, FileDown, FileText, Layers, Package, Sparkles } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { Product, ProductDetailSettings } from '@/lib/types';

interface ProductDetailTabsProps {
  product: Product;
  settings?: ProductDetailSettings;
  onOpenQuoteModal: (targetSku: string) => void;
}

export default function ProductDetailTabs({
  product,
  settings = DEFAULT_SITE_SETTINGS.product_detail,
  onOpenQuoteModal,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'certs'>('desc');

  const specsEntries = product.specifications ? Object.entries(product.specifications) : [];

  const certList: string[] =
    Array.isArray(product.certificates) && product.certificates.length > 0
      ? product.certificates
      : product.has_cocq
        ? settings.default_certificates
        : [];

  const highlightsList: string[] =
    Array.isArray(product.highlights) && product.highlights.length > 0
      ? product.highlights
      : settings.highlights;

  const packagingList: string[] =
    Array.isArray(product.packaging) && product.packaging.length > 0
      ? product.packaging
      : settings.packaging;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[72px] mt-10">
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {/* Tabs Header */}
        <div className="flex border-b border-[#dce2ea] bg-[#f8fafc] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-[#0b132b] text-[#0b132b] bg-white'
                : 'border-transparent text-[#475569] hover:text-[#0b132b]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>Mô Tả<span className="hidden sm:inline"> Sản Phẩm &amp; Ứng Dụng</span></span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#0b132b] text-[#0b132b] bg-white'
                : 'border-transparent text-[#475569] hover:text-[#0b132b]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>Thông Số<span className="hidden sm:inline"> Kỹ Thuật Chi Tiết</span> ({specsEntries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certs')}
            className={`px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] text-[13px] font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'certs'
                ? 'border-[#0b132b] text-[#0b132b] bg-white'
                : 'border-transparent text-[#475569] hover:text-[#0b132b]'
            }`}
          >
            <Award className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>Chứng Chỉ<span className="hidden sm:inline"> &amp; Tiêu Chuẩn Xuất Xưởng</span> ({certList.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-8">
          {/* TAB 1: Mô Tả */}
          {activeTab === 'desc' && (
            <div className="flex flex-col gap-6 max-w-[960px]">
              <div>
                <h3 className="text-[18px] font-bold text-[#0b132b] mb-3">
                  Giới Thiệu Chung & Mục Đích Sử Dụng
                </h3>
                <p className="text-[14px] text-[#475569] leading-relaxed whitespace-pre-line">
                  {product.description ||
                    `${product.name} là dòng sản phẩm cao cấp thuộc thương hiệu ${product.brand}, được AXIOM Industrial Supply nhập khẩu và phân phối trực tiếp cho các nhà máy cơ khí chế tạo, phân xưởng gia công CNC và các doanh nghiệp sản xuất phụ tùng chính xác.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc]">
                  <h4 className="text-[14px] font-bold text-[#0b132b] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                    Ưu Điểm Nổi Bật
                  </h4>
                  <ul className="text-[13px] text-[#475569] space-y-1.5 list-disc list-inside">
                    {highlightsList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc]">
                  <h4 className="text-[14px] font-bold text-[#0b132b] mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#f59e0b]" />
                    Quy Cách Đóng Gói & Xuất Xưởng
                  </h4>
                  <ul className="text-[13px] text-[#475569] space-y-1.5 list-disc list-inside">
                    {packagingList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Thông Số Kỹ Thuật */}
          {activeTab === 'specs' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0b132b]">
                    Bảng Thông Số Kỹ Thuật (Engineering Specification Sheet)
                  </h3>
                  <p className="text-[13px] text-[#475569]">
                    Được kiểm tra bởi phòng KCS AXIOM trước khi nhập kho.
                  </p>
                </div>
                {product.datasheet_url && (
                  <a
                    href={product.datasheet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#0b132b] hover:bg-[#152039] text-white text-[12px] font-semibold min-h-[40px] px-4 rounded-[4px] shrink-0 transition-colors self-start sm:self-auto"
                  >
                    <FileDown className="w-4 h-4 text-[#f59e0b]" />
                    <span>Tải Spec Sheet (PDF)</span>
                  </a>
                )}
              </div>

              {specsEntries.length === 0 ? (
                <div className="p-8 text-center text-[#475569] text-[13px]">
                  Sản phẩm đang được phòng kỹ thuật cập nhật thông số chi tiết.
                </div>
              ) : (
                <div className="border border-[#dce2ea] rounded-[6px] overflow-hidden">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                      <tr>
                        <th className="py-2.5 px-3.5 sm:py-3 sm:px-5 w-2/5 sm:w-1/3">Thuộc Tính Kỹ Thuật</th>
                        <th className="py-2.5 px-3.5 sm:py-3 sm:px-5">Giá Trị / Tiêu Chuẩn Thực Tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dce2ea]">
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                          Mã Định Danh (SKU)
                        </td>
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-mono font-bold text-[#0b132b]">
                          {product.sku}
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                          Nhà Sản Xuất / Thương Hiệu
                        </td>
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-medium text-[#0b132b]">
                          {product.brand}
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc]">
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                          Nhóm Phân Loại
                        </td>
                        <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 text-[#475569]">
                          {product.category?.name || 'Vật tư kỹ thuật'}
                        </td>
                      </tr>
                      {specsEntries.map(([key, val], idx) => (
                        <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 font-semibold text-[#0b132b] bg-[#f8fafc]/50">
                            {key}
                          </td>
                          <td className="py-2.5 px-3.5 sm:py-3 sm:px-5 text-[#0b132b] font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Chứng Chỉ */}
          {activeTab === 'certs' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#0b132b] mb-1">
                  Chứng Chỉ Xuất Xưởng & Pháp Lý Hàng Hóa
                </h3>
                <p className="text-[13px] text-[#475569]">
                  AXIOM cam kết cung cấp trọn bộ hồ sơ CO/CQ gốc và chứng nhận hợp chuẩn cho các dự án công nghiệp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certList.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[6px] p-5 flex flex-col justify-between gap-4 hover:border-[#0b132b] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[4px] bg-[#0b132b] text-[#f59e0b] flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-bold text-[#0b132b] leading-snug">
                          {cert}
                        </h4>
                        <span className="text-[11px] text-[#10b981] font-semibold mt-0.5 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Đã kiểm định hiệu lực
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#475569] border-t border-[#dce2ea] pt-3 flex items-center justify-between">
                      <span>KCS AXIOM Verified</span>
                      <span className="font-mono text-[#0b132b]">ISO/IEC 17025</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#f8fafc] border border-dashed border-[#475569] rounded-[6px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileDown className="w-6 h-6 text-[#0b132b]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#0b132b]">
                      Yêu cầu hồ sơ kỹ thuật đầy đủ (Dossier CO/CQ bản cứng)
                    </span>
                    <span className="text-[12px] text-[#475569]">
                      Cung cấp theo số hợp đồng dự án và biên bản bàn giao nghiệm thu.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(`${product.sku} - YÊU CẦU HỒ SƠ CO/CQ`)}
                  className="bg-[#0b132b] hover:bg-[#152039] text-white text-[12px] font-semibold h-[38px] px-4 rounded-[4px] shrink-0 transition-colors cursor-pointer"
                >
                  Yêu Cầu Trích Xuất CO/CQ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
