'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Loader2,
  Check,
  X,
  ExternalLink,
  Image as ImageIcon,
  Award,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  UploadCloud,
  Upload,
  FileImage,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Product, Category } from '@/lib/types';

interface SpecRow {
  key: string;
  value: string;
}

const PRESET_SAMPLE_IMAGES = [
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

const PRESET_CERTIFICATES = [
  'CO/CQ Gốc Nhà Máy',
  'ISO 9001:2015 Quản Lý Chất Lượng',
  'Chứng Nhận Hợp Chuẩn CE Directive',
  'Tiêu Chuẩn RoHS',
  'Biên Bản Kiểm Định KCS AXIOM',
  'Mill Test Certificate (MTR)',
  'JIS B 7507 Tiêu Chuẩn Công Nghiệp Nhật',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Upload & Drag-and-drop State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Form State
  const [form, setForm] = useState({
    category_id: 1,
    sku: '',
    name: '',
    brand: 'Axiom Tooling',
    stock_status: 'in_stock' as 'in_stock' | 'low_stock' | 'pre_order',
    price_display: 'Liên hệ báo giá',
    description: '',
    images: [] as string[],
    specRows: [] as SpecRow[],
    certificates: [] as string[],
    newImageUrl: '',
    customCertInput: '',
  });

  // Fetch Categories
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catId = urlParams.get('category_id');
      if (catId) {
        setCategoryFilter(catId);
      }
    }

    api.get('/categories')
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setForm((prev) => ({ ...prev, category_id: res.data.data[0].id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 12 };
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      if (stockFilter) params.stock_status = stockFilter;

      const res = await api.get('/admin/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination({
          total: res.data.pagination.total,
          current_page: res.data.pagination.current_page,
          last_page: res.data.pagination.last_page,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, stockFilter]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm({
      category_id: categories[0]?.id || 1,
      sku: 'AX-NEW-' + Math.floor(100 + Math.random() * 900),
      name: '',
      brand: 'Axiom Tooling',
      stock_status: 'in_stock',
      price_display: 'Liên hệ báo giá',
      description: '',
      images: [PRESET_SAMPLE_IMAGES[0], PRESET_SAMPLE_IMAGES[1]],
      specRows: [
        { key: 'Kích thước / Dải đo', value: '' },
        { key: 'Độ chính xác / Dung sai', value: '' },
        { key: 'Vật liệu chế tạo', value: '' },
      ],
      certificates: ['CO/CQ Gốc Nhà Máy', 'ISO 9001:2015 Quản Lý Chất Lượng'],
      newImageUrl: '',
      customCertInput: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);

    // Parse specs into array of rows
    const specEntries: SpecRow[] = p.specifications
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: 'Thông số kỹ thuật', value: '' }];

    // Prepare images list
    let initialImages: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      initialImages = [...p.images];
    } else if (p.image_url) {
      initialImages = [p.image_url];
    } else {
      initialImages = [PRESET_SAMPLE_IMAGES[0]];
    }

    // Prepare certificates list
    let initialCerts: string[] = [];
    if (Array.isArray(p.certificates) && p.certificates.length > 0) {
      initialCerts = [...p.certificates];
    } else if (p.has_cocq) {
      initialCerts = ['CO/CQ Gốc Nhà Máy'];
    }

    setForm({
      category_id: p.category_id,
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      stock_status: p.stock_status,
      price_display: p.price_display || 'Liên hệ báo giá',
      description: p.description || '',
      images: initialImages,
      specRows: specEntries,
      certificates: initialCerts,
      newImageUrl: '',
      customCertInput: '',
    });
    setIsModalOpen(true);
  };

  // Image upload and drag-and-drop actions
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadMessage(`Đang tải lên ${fileArray.length} ảnh...`);

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      const res = await api.post('/admin/products/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.data],
        }));
        setUploadMessage(`Đã tải lên thành công ${res.data.data.length} ảnh từ máy tính!`);
        setTimeout(() => setUploadMessage(null), 3500);
      }
    } catch (err) {
      console.warn('Backend upload không phản hồi, nạp ảnh trực tiếp qua Data URL:', err);
      // Fallback to base64 so user can still preview & save immediately
      const readPromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64List = await Promise.all(readPromises);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64List],
      }));
      setUploadMessage(`Đã nạp thành công ${base64List.length} ảnh từ máy tính.`);
      setTimeout(() => setUploadMessage(null), 3500);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Image actions
  const handleAddImageUrl = () => {
    if (!form.newImageUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: '',
    }));
  };

  const handleAddPresetImage = (url: string) => {
    if (form.images.includes(url)) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setForm((prev) => {
      const selected = prev.images[indexToPrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
  };

  // Specs actions
  const handleAddSpecRow = () => {
    setForm((prev) => ({
      ...prev,
      specRows: [...prev.specRows, { key: '', value: '' }],
    }));
  };

  const handleUpdateSpecRow = (index: number, field: 'key' | 'value', text: string) => {
    setForm((prev) => {
      const updated = [...prev.specRows];
      updated[index] = { ...updated[index], [field]: text };
      return { ...prev, specRows: updated };
    });
  };

  const handleRemoveSpecRow = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      specRows: prev.specRows.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Certificate actions
  const handleToggleCertificate = (certName: string) => {
    setForm((prev) => {
      const exists = prev.certificates.includes(certName);
      if (exists) {
        return { ...prev, certificates: prev.certificates.filter((c) => c !== certName) };
      } else {
        return { ...prev, certificates: [...prev.certificates, certName] };
      }
    });
  };

  const handleAddCustomCert = () => {
    if (!form.customCertInput.trim()) return;
    const cert = form.customCertInput.trim();
    if (!form.certificates.includes(cert)) {
      setForm((prev) => ({
        ...prev,
        certificates: [...prev.certificates, cert],
        customCertInput: '',
      }));
    }
  };

  const handleRemoveCertificate = (certToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c !== certToRemove),
    }));
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sku || !form.name) {
      alert('Vui lòng nhập đầy đủ mã SKU và tên sản phẩm.');
      return;
    }

    setSaving(true);

    // Convert specRows to Record<string, string>
    const specsPayload: Record<string, string> = {};
    form.specRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsPayload[row.key.trim()] = row.value.trim();
      }
    });

    const primaryImage = form.images[0] || PRESET_SAMPLE_IMAGES[0];

    const payload = {
      category_id: form.category_id,
      sku: form.sku,
      name: form.name,
      brand: form.brand,
      stock_status: form.stock_status,
      price_display: form.price_display,
      description: form.description,
      image_url: primaryImage,
      images: form.images.length > 0 ? form.images : [primaryImage],
      specifications: specsPayload,
      has_cocq: form.certificates.length > 0,
      certificates: form.certificates,
    };

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts(pagination.current_page);
    } catch (err) {
      console.error(err);
      alert('Lỗi lưu sản phẩm. Vui lòng kiểm tra mã SKU không trùng lặp.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts(pagination.current_page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#0b132b]">
              Quản Lý Sản Phẩm (Kho SKU)
            </h1>
            <span className="bg-[#0b132b] text-white text-[11px] font-bold px-2 py-0.5 rounded-[3px]">
              CMS v2.0
            </span>
          </div>
          <p className="text-[13px] text-[#475569]">
            Quản trị đa ảnh sản phẩm, thông số kỹ thuật đa chiều, chứng chỉ CO/CQ và liên kết trực tiếp trang chi tiết.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#0b132b] hover:bg-[#152039] text-white text-[13px] font-semibold h-[42px] px-4 rounded-[4px] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#f59e0b]" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-[320px] bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] focus-within:border-[#0b132b]">
          <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo SKU, tên thiết bị, hãng..."
            className="bg-transparent focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Lọc theo danh mục"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b] focus:outline-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Lọc theo tình trạng tồn kho"
            className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] px-3 py-2 text-[13px] text-[#0b132b] focus:outline-none"
          >
            <option value="">Tất cả tồn kho</option>
            <option value="in_stock">Hàng có sẵn</option>
            <option value="low_stock">Sắp hết hàng</option>
            <option value="pre_order">Đặt trước</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#dce2ea] rounded-[8px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
            <span className="text-[13px] text-[#475569]">Đang tải danh sách SKU...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-[#475569] text-[13px]">
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[#475569] text-[11px] font-semibold uppercase tracking-wider border-b border-[#dce2ea]">
                <tr>
                  <th className="py-3 px-4 w-[80px]">Hình ảnh</th>
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-5">Tên Sản Phẩm (Bấm để xem)</th>
                  <th className="py-3 px-4">Danh Mục</th>
                  <th className="py-3 px-4">Thương Hiệu</th>
                  <th className="py-3 px-4">Tồn Kho</th>
                  <th className="py-3 px-4">Chứng Chỉ</th>
                  <th className="py-3 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce2ea]">
                {products.map((p) => {
                  const thumbnail = (Array.isArray(p.images) && p.images[0]) || p.image_url || PRESET_SAMPLE_IMAGES[0];
                  const imgCount = Array.isArray(p.images) ? p.images.length : (p.image_url ? 1 : 0);

                  return (
                    <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors group">
                      {/* Product Thumbnail with Image Count Badge */}
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-[4px] bg-[#f1f5f9] border border-[#dce2ea] overflow-hidden flex items-center justify-center shrink-0">
                          <Image
                            src={thumbnail}
                            alt={p.name}
                            fill
                            unoptimized={thumbnail.startsWith('data:') || thumbnail.startsWith('http')}
                            className="object-contain p-1"
                          />
                          {imgCount > 1 && (
                            <span className="absolute bottom-0 right-0 bg-[#0b132b]/90 text-white text-[9px] font-mono px-1 rounded-tl-[3px] leading-tight font-bold">
                              {imgCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0b132b] whitespace-nowrap">
                        {p.sku}
                      </td>

                      {/* Name with Direct Link to Detail Page */}
                      <td className="py-3.5 px-5">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#0b132b] hover:text-[#d97706] transition-colors flex items-center gap-1.5 max-w-[320px] line-clamp-1 group/link"
                          title="Mở trang chi tiết sản phẩm ở tab mới"
                        >
                          <span>{p.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover/link:text-[#d97706] shrink-0" />
                        </a>
                        {p.specifications && (
                          <div className="text-[11px] text-[#94a3b8] max-w-[320px] truncate mt-0.5">
                            {Object.entries(p.specifications).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">
                        {p.category?.name || 'Vật tư'}
                      </td>

                      {/* Brand */}
                      <td className="py-3.5 px-4 font-medium text-[#0b132b] whitespace-nowrap">
                        {p.brand}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {p.stock_status === 'in_stock' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Có sẵn
                          </span>
                        ) : p.stock_status === 'low_stock' ? (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                            Đặt hàng
                          </span>
                        )}
                      </td>

                      {/* Certificates */}
                      <td className="py-3.5 px-4">
                        {Array.isArray(p.certificates) && p.certificates.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            <span className="bg-blue-50 text-[#0b132b] border border-blue-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                              {p.certificates[0].split(' ')[0]}
                            </span>
                            {p.certificates.length > 1 && (
                              <span className="bg-[#f8fafc] text-[#475569] border border-[#dce2ea] text-[10px] px-1 py-0.5 rounded-[2px]">
                                +{p.certificates.length - 1}
                              </span>
                            )}
                          </div>
                        ) : p.has_cocq ? (
                          <span className="text-[#10b981] font-semibold text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> CO/CQ
                          </span>
                        ) : (
                          <span className="text-[#94a3b8] text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#475569] hover:text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors"
                            title="Xem trang chi tiết ngoài web (tab mới)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-[#0b132b] hover:bg-[#dce2ea] rounded-[4px] transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin sản phẩm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-[#dce2ea] flex items-center justify-between text-[12px] text-[#475569]">
            <span>Tổng số {pagination.total} sản phẩm</span>
            <div className="flex gap-1.5">
              {Array.from({ length: pagination.last_page }).map((_, idx) => {
                const pg = idx + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => fetchProducts(pg)}
                    className={`w-8 h-8 rounded-[4px] text-[12px] font-medium transition-colors ${
                      pagination.current_page === pg
                        ? 'bg-[#0b132b] text-white font-bold'
                        : 'bg-[#f8fafc] border border-[#dce2ea] hover:bg-[#dce2ea] text-[#0b132b]'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Optimized Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b132b]/60 backdrop-blur-[2px]">
          <div className="bg-white border border-[#dce2ea] rounded-[8px] w-full max-w-[760px] p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-[#0b132b] text-white flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0b132b]">
                    {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới (SKU)'}
                  </h3>
                  <p className="text-[12px] text-[#475569]">
                    Cập nhật ảnh thư viện, thông số kỹ thuật đa chiều và chứng nhận chất lượng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingProduct && (
                  <a
                    href={`/products/${editingProduct.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#0b132b] hover:text-[#d97706] font-semibold flex items-center gap-1 bg-[#f8fafc] border border-[#dce2ea] px-2.5 py-1.5 rounded-[4px] transition-colors"
                    title="Mở xem trang chi tiết ở tab mới"
                  >
                    <span>Xem trang web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-[4px] hover:bg-[#f8fafc] text-[#475569] transition-colors cursor-pointer"
                  title="Đóng modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="AX-..."
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] font-mono uppercase focus:outline-none focus:border-[#0b132b]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Nhóm Danh Mục *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#0b132b]">Tên Thiết Bị / Dụng Cụ *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Trung Tâm Gia Công Đứng CNC VMC-850"
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Thương Hiệu</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Mitutoyo, Axiom, SKF..."
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Tình Trạng Kho</label>
                  <select
                    value={form.stock_status}
                    onChange={(e) => setForm({ ...form, stock_status: e.target.value as 'in_stock' | 'low_stock' | 'pre_order' })}
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none"
                  >
                    <option value="in_stock">Hàng có sẵn</option>
                    <option value="low_stock">Sắp hết hàng</option>
                    <option value="pre_order">Đặt hàng theo lịch</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-[#0b132b]">Hiển Thị Giá</label>
                  <input
                    type="text"
                    value={form.price_display}
                    onChange={(e) => setForm({ ...form, price_display: e.target.value })}
                    placeholder="Liên hệ báo giá"
                    className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none"
                  />
                </div>
              </div>

              {/* 1. Multiple Images Management with Drag & Drop Upload */}
              <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                    <ImageIcon className="w-4 h-4 text-[#f59e0b]" />
                    <span>Bộ Sưu Tập Ảnh Sản Phẩm ({form.images.length} ảnh)</span>
                  </div>
                  <span className="text-[11px] text-[#475569]">
                    Ảnh đầu tiên sẽ là ảnh bìa đại diện
                  </span>
                </div>

                {/* Drag & Drop Upload Zone from Computer */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDropFiles}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[6px] p-5 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#f59e0b] bg-[#fef3c7]/50 scale-[1.01]'
                      : 'border-[#cbd5e1] bg-white hover:border-[#0b132b] hover:bg-[#f8fafc]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadFiles(e.target.files);
                      }
                    }}
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-8 h-8 text-[#0b132b] animate-spin" />
                      <span className="text-[13px] font-semibold text-[#0b132b]">
                        {uploadMessage || 'Đang tải ảnh lên...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#dce2ea] flex items-center justify-center text-[#0b132b] shadow-2xs">
                        <UploadCloud className="w-5 h-5 text-[#f59e0b]" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-bold text-[#0b132b]">
                          Kéo & thả ảnh từ máy tính vào đây, hoặc <span className="text-[#d97706] underline">bấm để chọn file</span>
                        </span>
                        <span className="text-[11px] text-[#475569]">
                          Hỗ trợ chọn nhiều ảnh cùng lúc: PNG, JPG, JPEG, WEBP (Tối đa 10MB/ảnh)
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Upload Status Banner */}
                {uploadMessage && !isUploading && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] px-3 py-2 rounded-[4px] flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadMessage}</span>
                  </div>
                )}

                {/* Current images grid */}
                {form.images.length === 0 ? (
                  <div className="p-4 text-center text-[#94a3b8] text-[12px] bg-white border border-[#dce2ea] rounded-[4px]">
                    Chưa có ảnh nào. Kéo thả ảnh từ máy tính hoặc dán link URL bên dưới.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {form.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white border border-[#dce2ea] rounded-[4px] p-2 flex flex-col items-center gap-1.5 group hover:border-[#0b132b] transition-colors"
                      >
                        <div className="relative w-full h-[85px] bg-[#f8fafc] rounded-[2px] overflow-hidden flex items-center justify-center">
                          <Image
                            src={imgUrl}
                            alt={`Product preview ${idx}`}
                            fill
                            unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('http')}
                            className="object-contain p-1"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#0b132b] text-[#f59e0b] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] shadow-xs">
                              Ảnh Bìa
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between w-full pt-1 text-[11px]">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-[#0b132b] hover:text-[#d97706] text-[10px] font-medium"
                            >
                              Đặt làm bìa
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-semibold text-[10px]">Chính</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-red-500 hover:text-red-700 p-0.5 rounded"
                            title="Xóa ảnh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image URL input */}
                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    value={form.newImageUrl}
                    onChange={(e) => setForm({ ...form, newImageUrl: e.target.value })}
                    placeholder="Hoặc dán URL ảnh trực tiếp (vd: https://... hoặc /assets/...)"
                    className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0b132b]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-[#0b132b] text-white text-[12px] px-3 py-1.5 rounded-[4px] font-medium hover:bg-[#152039] shrink-0"
                  >
                    + Thêm Link
                  </button>
                </div>

                {/* Quick Pick Sample Images */}
                <div className="pt-2 border-t border-[#dce2ea]/70 flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-[#475569]">
                    Chọn nhanh từ thư viện ảnh cơ khí chuẩn AXIOM:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_SAMPLE_IMAGES.map((sampleUrl, sIdx) => {
                      const isAdded = form.images.includes(sampleUrl);
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleAddPresetImage(sampleUrl)}
                          className={`relative w-12 h-12 bg-white border rounded-[4px] shrink-0 overflow-hidden p-1 transition-all ${
                            isAdded ? 'border-[#10b981] ring-1 ring-[#10b981] opacity-60' : 'border-[#dce2ea] hover:border-[#0b132b]'
                          }`}
                          title={isAdded ? 'Đã thêm' : 'Bấm để thêm ảnh này'}
                        >
                          <Image src={sampleUrl} alt={`Sample ${sIdx + 1}`} fill className="object-contain p-0.5" />
                          {isAdded && (
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-emerald-800 font-bold" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Dynamic Technical Specifications */}
              <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                    <Layers className="w-4 h-4 text-[#f59e0b]" />
                    <span>Thông Số Kỹ Thuật Chi Tiết ({form.specRows.length} thông số)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-[12px] bg-white border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] px-2.5 py-1 rounded-[4px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Thêm Dòng Thông Số</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {form.specRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                        placeholder="Tên thông số (vd: Hành trình X/Y/Z)"
                        className="w-1/2 bg-white border border-[#dce2ea] rounded-[4px] p-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                        placeholder="Giá trị (vd: 800 x 500 x 550 mm)"
                        className="w-1/2 bg-white border border-[#dce2ea] rounded-[4px] p-2 text-[12px] focus:outline-none focus:border-[#0b132b]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[4px] shrink-0"
                        title="Xóa thông số này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Certificates & Compliance Manager */}
              <div className="border border-[#dce2ea] rounded-[6px] p-4 bg-[#f8fafc] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#0b132b]">
                    <Award className="w-4 h-4 text-[#f59e0b]" />
                    <span>Chứng Chỉ & Tiêu Chuẩn Xuất Xưởng ({form.certificates.length})</span>
                  </div>
                  <span className="text-[11px] text-[#475569]">
                    Kích hoạt hiển thị nhãn chứng nhận trên web
                  </span>
                </div>

                {/* Popular certificate presets */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CERTIFICATES.map((cert) => {
                    const isSelected = form.certificates.includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => handleToggleCertificate(cert)}
                        className={`text-[11px] px-2.5 py-1 rounded-[4px] font-medium border transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#0b132b] text-white border-[#0b132b]'
                            : 'bg-white text-[#475569] border-[#dce2ea] hover:border-[#0b132b]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#f59e0b]" />}
                        <span>{cert}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom certificate input */}
                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    value={form.customCertInput}
                    onChange={(e) => setForm({ ...form, customCertInput: e.target.value })}
                    placeholder="Nhập tên chứng chỉ tiêu chuẩn khác..."
                    className="flex-1 bg-white border border-[#dce2ea] rounded-[4px] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0b132b]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCert}
                    className="bg-[#f8fafc] border border-[#dce2ea] hover:border-[#0b132b] text-[#0b132b] text-[12px] px-3 py-1.5 rounded-[4px] font-medium shrink-0"
                  >
                    + Thêm Chứng Chỉ
                  </button>
                </div>

                {/* Selected certificates tag list */}
                {form.certificates.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.certificates.map((c) => (
                      <span
                        key={c}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded-[3px] flex items-center gap-1"
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(c)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#0b132b]">Mô Tả Kỹ Thuật & Ứng Dụng</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả tiêu chuẩn CO/CQ, ứng dụng trong phân xưởng gia công, bảo hành..."
                  className="bg-[#f8fafc] border border-[#dce2ea] rounded-[4px] p-2 text-[13px] focus:outline-none focus:border-[#0b132b] resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#dce2ea]">
                {editingProduct ? (
                  <a
                    href={`/products/${editingProduct.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#0b132b] hover:text-[#d97706] font-semibold flex items-center gap-1"
                  >
                    <span>Mở trang chi tiết sản phẩm ngoài web</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#dce2ea] text-[#475569] hover:bg-[#f8fafc] rounded-[4px] text-[13px] font-medium"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-[#0b132b] hover:bg-[#152039] text-white rounded-[4px] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingProduct ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
