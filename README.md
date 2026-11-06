# AXIOM Industrial Supply — Dự Án Landing Bán Hàng & Admin CMS

Hệ thống web thương mại & chào thầu công nghiệp **AXIOM Industrial Supply** bao gồm:
1. **Public Landing Page** (`/` và `/products`): Bám sát 100% bản vẽ Figma Axiom Industrial Supply, gồm các khối Hero, Trust Bar (CO/CQ, 1000+ SKU), Danh mục thiết bị, Bảng tra thông số kỹ thuật nhanh (Quick Spec Table), Năng lực kho bãi, Form đăng ký báo giá B2B, Lưới 54 sản phẩm thực tế và Modal liên hệ nhanh.
2. **Admin CMS** (`/admin`): Bảo mật qua **JWT Authentication**, gồm Dashboard tổng quan, Quản lý tiếp nhận yêu cầu báo giá (Leads B2B), Quản lý sản phẩm (CRUD 54 SKU).

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

### Cách 1: Khởi chạy 1 chạm bằng Script (Khuyên dùng)
Bạn chỉ cần nhấp đúp chuột vào file:
- **`start.bat`** (hoặc chạy `.\start.ps1` trong PowerShell)

Script sẽ tự động:
1. Mở cửa sổ khởi động **Backend Laravel 12** trên `http://127.0.0.1:8000`.
2. Mở cửa sổ khởi động **Frontend Next.js 15** trên `http://localhost:3000`.
3. Tự động mở trình duyệt vào trang chủ hệ thống.

---

### Cách 2: Khởi chạy thủ công từng phần
Yêu cầu: PHP 8.2+ (Target PHP 8.2.35)

```bash
cd backend
php artisan serve --port=8000
```
> API sẽ sẵn sàng tại: `http://localhost:8000/api`

### 2. Khởi chạy Frontend Next.js 15 (Port 3000)

```bash
cd frontend
npm run dev
```
> Ứng dụng sẽ sẵn sàng tại: `http://localhost:3000`

---

## 🔐 Thông Tin Đăng Nhập CMS Quản Trị

- **Đường dẫn**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@axiom.vn`
- **Mật khẩu**: `Password@123`
- **Cơ chế xác thực**: JWT Bearer Token (`php-open-source-saver/jwt-auth`)

---

## 🗄️ Cấu Hình Cơ Sở Dữ Liệu (MySQL / SQLite)

- **Mặc định sẵn sàng**: Dự án đang chạy sẵn với SQLite database (`backend/database/database.sqlite`) đã nạp đầy đủ tài khoản admin và 54 sản phẩm mẫu chuẩn theo thiết kế Figma.
- **Chuyển sang MySQL (Laragon)**:
  1. Khởi động dịch vụ MySQL trên Laragon.
  2. Tạo cơ sở dữ liệu tên `landing_banhang`.
  3. Trong file `backend/.env`, chỉnh sửa:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=landing_banhang
     DB_USERNAME=root
     DB_PASSWORD=
     ```
  4. Chạy lệnh migrate & nạp dữ liệu:
     ```bash
     cd backend
     php artisan migrate:fresh --seed
     ```

---

## 📐 Hệ Thống Thiết Kế (Axiom Design System)

Toàn bộ quy chuẩn token thiết kế theo chuẩn Google Labs Code được định nghĩa tại file:
- [`DESIGN.md`](./DESIGN.md)

### Bảng màu nhận diện thương hiệu:
- **Primary Navy**: `#0b132b` (Màu xanh đen công nghiệp)
- **Secondary Dark Navy**: `#152039` (Nền thẻ chứng nhận, container dark)
- **Accent Amber**: `#f59e0b` (Màu cam an toàn - Nút Yêu cầu báo giá, CTA)
- **Neutral Background**: `#f8fafc` (Nền trang danh mục)
- **Borders**: `#dce2ea` / `#475569` (Đường kẻ kỹ thuật mỏng 1px)
- **Bo góc**: `rounded-[4px]` cho buttons & inputs (mô phỏng chi tiết máy cơ khí).
