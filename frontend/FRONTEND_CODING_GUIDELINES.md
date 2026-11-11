# QUY ĐỊNH KIẾN TRÚC & CHUẨN CODE FRONTEND (PRODUCTION-GRADE NEXT.JS ARCHITECTURE)

Tài liệu này là **Quy chuẩn bắt buộc (Mandatory Coding Standard)** cho toàn bộ lập trình viên và các AI Coding Agent (Antigravity, Cursor, Claude, Copilot, Windsurf...) khi tham gia phát triển, sửa đổi hoặc mở rộng hệ thống **Frontend Next.js (`frontend/`)** của dự án **AXIOM Industrial Supply**.

---

## 1. Sơ Đồ Kiến Trúc Phân Tầng Bắt Buộc (5-Layer Frontend Architecture)

Mọi tính năng giao diện và kết nối API trên Frontend bắt buộc phải đi qua 5 tầng độc lập trách nhiệm:

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. Page / Route Container (src/app/**/page.tsx)                    │
│    - Điều phối route, đọc URL params, lắp ghép Feature Components  │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│ 2. Feature & UI Components (src/components/**)                     │
│    - Hiển thị UI thuần túy hoặc đóng gói logic form/modal độc lập │
│    - Mỗi file component không vượt quá 350 dòng code               │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│ 3. Custom Hooks & Utilities (src/hooks/*, src/lib/*, src/constants)│
│    - useDebounce, authStorage, getApiErrorMessage, constants       │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│ 4. Typed API Services (src/services/*.service.ts)                  │
│    - Định nghĩa toàn bộ hàm gọi API có kiểu dữ liệu đầu vào/ra    │
│    - Trích xuất dữ liệu chuẩn từ ApiResponse<T> / Paginated<T>     │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│ 5. HTTP Client & Interceptors (src/lib/api.ts)                     │
│    - Axios instance duy nhất, tự động đính kèm JWT & bắt lỗi 401   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cấu Trúc Thư Mục Chuẩn (`frontend/src/`)

```text
frontend/src/
├── app/                          # Tầng 1: Next.js App Router Pages & Boundaries
│   ├── error.tsx                 # Global Error Boundary
│   ├── not-found.tsx             # Custom 404 Not Found Page
│   ├── page.tsx                  # Public Landing Page
│   ├── products/
│   │   ├── page.tsx              # Catalog Page (wrapped in <Suspense> for searchParams)
│   │   └── [slug]/page.tsx       # Product Detail Page
│   └── admin/
│       ├── layout.tsx            # Admin Shell & Auth Guard
│       ├── login/page.tsx        # Admin Login
│       ├── dashboard/page.tsx    # Dashboard Overview
│       ├── categories/page.tsx   # Category Management Page
│       ├── products/page.tsx     # Product Management Page
│       └── quotes/page.tsx       # Quote Request Management Page
├── components/                   # Tầng 2: Feature & Shared UI Components
│   ├── landing/                  # Landing Page Sections & ContactModal / QuoteRequestForm
│   ├── products/                 # Product Feature Components
│   │   ├── ProductCard.tsx
│   │   ├── CatalogFilterSidebar.tsx
│   │   ├── ProductImageGallery.tsx
│   │   └── ProductDetailTabs.tsx
│   └── admin/                    # Admin CMS Modals & Feature Components
│       ├── CategoryFormModal.tsx
│       ├── ProductFormModal.tsx
│       └── QuoteDetailModal.tsx
├── hooks/                        # Tầng 3: Reusable React Hooks
│   └── useDebounce.ts            # Debounce giá trị tìm kiếm/lọc
├── constants/                    # Tầng 3: Hằng số dùng chung toàn hệ thống
│   └── index.ts                  # SAMPLE_PRODUCT_IMAGES, PRESET_CERTIFICATES, BRAND_FILTER_OPTIONS...
├── services/                     # Tầng 4: Typed API Service Layer
│   ├── index.ts                  # Barrel export
│   ├── auth.service.ts           # Auth API (login, logout, me)
│   ├── category.service.ts       # Category API (public & admin CRUD)
│   ├── product.service.ts        # Product API (catalog, detail, featured, admin CRUD & upload)
│   ├── quote.service.ts          # Quote API (submit public quote, admin list/detail/update/delete)
│   └── dashboard.service.ts      # Dashboard Stats API
└── lib/                          # Tầng 5: Core Infrastructure & Types
    ├── api.ts                    # Axios instance & Interceptors
    ├── auth-storage.ts           # SSR-safe JWT token & user storage
    ├── error-handler.ts          # getApiErrorMessage(err, fallback)
    └── types.ts                  # TypeScript Interfaces & API Envelope Types
```

---

## 3. Quy Tắc Chi Tiết Cho Từng Tầng

### 3.1. Tầng Typed API Services (`src/services/*.service.ts`)
- **Bắt buộc**: Mọi lời gọi HTTP (`api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`) **CHỈ ĐƯỢC PHÉP** nằm trong thư mục `src/services/`.
- **Nghiêm cấm**: Tuyệt đối không import `api` từ `@/lib/api` trực tiếp vào bất kỳ file nào trong `src/app/` hoặc `src/components/`.
- **Kiểu dữ liệu (Strict Typing)**:
  - Mọi hàm trong Service phải khai báo rõ kiểu tham số đầu vào (ví dụ: `ProductFilterParams`, `QuoteCreatePayload`) và kiểu trả về (`Promise<Product[]>`, `Promise<PaginatedApiResponse<Product>>`).
  - Không sử dụng `any` cho dữ liệu trả về từ API.

### 3.2. Tầng Components & Pages (`src/components/`, `src/app/`)
- **Giới hạn kích thước file**: Không viết file Page hoặc Component vượt quá **350 dòng**. Khi một trang có Modal phức tạp, Sidebar bộ lọc, hoặc Tabs chi tiết, bắt buộc phải tách thành các Feature Components con trong `src/components/products/` hoặc `src/components/admin/`.
- **Đồng bộ URL Query Params**:
  - Các trang danh sách công khai (như `/products`) khi lọc theo danh mục hoặc từ khóa phải đồng bộ với URL (`useSearchParams`) và bọc trong `<Suspense>` theo chuẩn Next.js 15 App Router.
- **Tối ưu hiệu năng tìm kiếm (Debounce)**:
  - Mọi ô nhập liệu tìm kiếm (`search`) có gọi API bắt buộc phải đi qua hook `useDebounce(search, 300)` trước khi đưa vào dependency array của `useEffect` hoặc hàm `useCallback` tải dữ liệu.
- **Đồng bộ Props vào State của Modal**:
  - Khi một Modal nhận props khởi tạo từ bên ngoài (ví dụ `initialSku` trong `ContactModal` hoặc `editingProduct` trong `ProductFormModal`), bắt buộc phải có `useEffect` lắng nghe `[isOpen, initialProp]` để đồng bộ state mỗi khi Modal mở.

### 3.3. Quản Lý Xác Thực & Xử Lý Lỗi (`src/lib/`)
- **Không gọi trực tiếp `localStorage` rải rác**:
  - Mọi thao tác đọc/ghi/xóa JWT Token (`axiom_admin_token`) và thông tin Admin (`axiom_admin_user`) bắt buộc phải gọi qua `authStorage` (`@/lib/auth-storage`).
- **Chuẩn hóa bắt lỗi `catch (err: unknown)`**:
  - Không dùng `catch (err: any)` và tự viết chuỗi `err?.response?.data?.message`.
  - Bắt buộc dùng `catch (err: unknown)` kết hợp hàm `getApiErrorMessage(err, 'Thông báo mặc định')` từ `@/lib/error-handler`.

### 3.4. Quản Lý Hằng Số & Dữ Liệu Tĩnh (`src/constants/index.ts`)
- Không khai báo lặp lại mảng ảnh mẫu (`SAMPLE_PRODUCT_IMAGES`), danh sách chứng chỉ (`PRESET_CERTIFICATES`), hoặc danh sách thương hiệu (`BRAND_FILTER_OPTIONS`) ở nhiều component khác nhau. Tất cả phải import từ `@/constants`.

---

## 4. Hệ Thống Thiết Kế (Axiom Industrial Design System)

Mọi Component tạo mới hoặc chỉnh sửa phải tuân thủ tuyệt đối [`DESIGN.md`](../DESIGN.md):
- **Primary Navy**: `#0b132b` (Header, Footer, nút chính khối sáng)
- **Secondary Dark Navy**: `#152039` (Khối thẻ tối, badge nền tối)
- **Safety Amber (CTA)**: `#f59e0b` hover `#d97706` (Nút hành động chính, điểm nhấn kỹ thuật)
- **Background**: `#f8fafc` (Nền trang danh mục/admin), `#ffffff` (Nền thẻ/bảng)
- **Technical Border**: `border-[#dce2ea]` (1px solid)
- **Border Radius**: `rounded-[4px]` cho nút bấm, ô input, badge; `rounded-[8px]` cho card và modal.

---

## 5. Checklist Kiểm Tra Trước Khi Hoàn Thành Task (Definition of Done)

Trước khi kết thúc bất kỳ công việc sửa đổi code Frontend nào, lập trình viên hoặc AI Agent bắt buộc phải kiểm tra:

1. [ ] Có bất kỳ file nào trong `src/app/` hoặc `src/components/` gọi trực tiếp `api.get/post/put/patch/delete` không? *(Nếu có → Chuyển ngay vào `src/services/*.service.ts`)*.
2. [ ] Có sử dụng `any` hoặc `localStorage` trực tiếp trong component không? *(Nếu có → Thay bằng kiểu trong `src/lib/types.ts`, `getApiErrorMessage`, và `authStorage`)*.
3. [ ] Các ô tìm kiếm (`search`) đã áp dụng `useDebounce` chưa?
4. [ ] Chạy kiểm tra TypeScript và ESLint không có lỗi:
   ```powershell
   Push-Location frontend; npx tsc --noEmit; npm run lint; Pop-Location
   ```
