# Hướng Dẫn Đưa AXIOM Industrial Supply Lên Demo Miễn Phí (100% Free — \$0/tháng)

Hướng dẫn này giúp bạn đưa toàn bộ hệ thống (**Frontend Next.js 16** + **Backend Laravel 12** + **Database PostgreSQL**) lên internet với đường dẫn HTTPS miễn phí để gửi cho khách hàng xem bất cứ lúc nào.

---

## Kiến Trúc Triển Khai

1. **Database (PostgreSQL):** [Neon.tech](https://neon.tech) — Gói Free vĩnh viễn (\$0/tháng), lưu bền vững 54 sản phẩm mẫu & Lead báo giá khách hàng gửi lên.
2. **Backend (Laravel 12 API):** [Render.com](https://render.com) — Gói Free Web Service (Docker, \$0/tháng, không cần thẻ tín dụng).
3. **Frontend (Next.js 16):** [Vercel](https://vercel.com) — Gói Hobby Free (\$0/tháng), không sleep, phục vụ toàn bộ UI và ảnh sản phẩm mẫu.

> **Yêu cầu trước khi bắt đầu:** Đẩy mã nguồn dự án này lên một repository **GitHub** (Public hoặc Private đều được).

---

## Bước 1: Tạo Database PostgreSQL Miễn Phí trên Neon.tech

1. Đăng nhập [https://console.neon.tech](https://console.neon.tech) (dùng tài khoản GitHub).
2. Nhấn **New Project** → đặt tên (ví dụ `axiom-demo`), chọn Region gần nhất (ví dụ `Singapore` nếu có).
3. Sau khi tạo xong, tại mục **Connection Details**, copy chuỗi **Connection string** (dạng `postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require`).
4. Lưu lại chuỗi này — đây chính là biến `DB_URL` (hoặc `DATABASE_URL`) cho Bước 2.

---

## Bước 2: Deploy Backend Laravel lên Render.com (Free)

1. Đăng nhập [https://dashboard.render.com](https://dashboard.render.com) bằng GitHub.
2. Nhấn **New +** → chọn **Web Service** → kết nối tới repo GitHub của dự án.
3. Điền thông số:
   - **Name:** `axiom-backend-demo`
   - **Root Directory:** `backend`
   - **Language / Runtime:** `Docker` (Render sẽ tự đọc `backend/Dockerfile`)
   - **Instance Type:** `Free` (\$0/month)
4. Kéo xuống mục **Environment Variables**, thêm các biến sau:

| Key | Value | Ghi chú |
| :--- | :--- | :--- |
| `APP_NAME` | `AXIOM Industrial Supply` | |
| `APP_ENV` | `production` | |
| `APP_DEBUG` | `false` | |
| `APP_KEY` | *(Chạy `php artisan key:generate --show` ở local để lấy)* | Bắt buộc có `base64:...` |
| `JWT_SECRET` | *(Chạy `php artisan jwt:secret --show` hoặc chuỗi ngẫu nhiên 64 ký tự)* | Bắt buộc cho Admin Login |
| `APP_URL` | `https://axiom-backend-demo.onrender.com` | Thay bằng URL Render của bạn |
| `DB_CONNECTION` | `pgsql` | |
| `DB_URL` | `postgresql://...` | Chuỗi lấy từ **Neon.tech** ở Bước 1 |
| `SESSION_DRIVER` | `cookie` | Hoạt động ổn định không cần bảng sessions |
| `CACHE_STORE` | `file` | |
| `CORS_ALLOWED_ORIGINS` | `*` | Sau khi có link Vercel, có thể đổi thành `https://your-app.vercel.app` |
| `PHP_CLI_SERVER_WORKERS` | `4` | |

5. Nhấn **Create Web Service**. Render sẽ build Docker và tự động chạy `migrate` (bao gồm cả các cột SEO `meta_title`, `meta_description`, `meta_keywords`) + `db:seed` (nạp sẵn 54 sản phẩm & tài khoản admin).
6. Khi trạng thái chuyển sang **Live**, kiểm tra thử bằng cách mở:
   - `https://<ten-service-cua-ban>.onrender.com/up` → thấy trang xanh `Application up` là thành công!
   - `https://<ten-service-cua-ban>.onrender.com/api/products` → trả về JSON danh sách sản phẩm.
   - `https://<ten-service-cua-ban>.onrender.com/api/products/sitemap` → trả về danh sách `slug` phục vụ tạo `sitemap.xml`.

---

## Bước 3: Deploy Frontend Next.js lên Vercel (Free)

1. Đăng nhập [https://vercel.com](https://vercel.com) bằng GitHub.
2. Nhấn **Add New...** → **Project** → Import repo dự án.
3. Cấu hình Project:
   - **Framework Preset:** `Next.js` (tự nhận diện)
   - **Root Directory:** Nhấn **Edit** và chọn `frontend`
4. Mở mục **Environment Variables**, thêm 2 biến sau:
   - **Biến 1 — API Backend:**
     - **Name:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://<ten-service-cua-ban>.onrender.com/api` *(Lưu ý: có `/api` ở cuối, không có dấu `/` dư)*
   - **Biến 2 — Domain chính thức cho SEO (`canonical`, `sitemap.xml`, `robots.txt`):**
     - **Name:** `NEXT_PUBLIC_SITE_URL`
     - **Value:** `https://<ten-app-cua-ban>.vercel.app` *(hoặc domain riêng nếu đã trỏ custom domain, không có dấu `/` ở cuối)*
5. Nhấn **Deploy** và chờ ~1–2 phút.
6. Hoàn tất! Vercel sẽ cấp cho bạn link demo dạng `https://axiom-demo.vercel.app` để gửi cho khách hàng. *(Lưu ý: quay lại Render Bước 2 cập nhật `CORS_ALLOWED_ORIGINS` thành link Vercel nếu muốn siết bảo mật CORS).*

---

## Bước 4 (Khuyên dùng): Giữ Backend Render Không Bị Sleep (Tối Ưu Tốc Độ & Googlebot SSR)

Gói miễn phí của Render sẽ tạm ngủ nếu **15 phút** không có request nào (khi ngủ dậy sẽ mất ~30–50 giây ở lần tải đầu). Do các trang public (`/`, `/products`, `/products/[slug]`) và `/sitemap.xml` chạy **SSR** gọi API Backend, việc giữ Render luôn thức giúp **khách hàng và Googlebot** tải trang tức thì mà không bị timeout:

1. Tạo tài khoản miễn phí tại [https://cron-job.org](https://cron-job.org) hoặc [https://uptimerobot.com](https://uptimerobot.com).
2. Tạo 1 lịch ping **HTTP GET** mỗi **10 phút** tới URL:
   ```text
   https://<ten-service-cua-ban>.onrender.com/up
   ```
3. Nhờ vậy backend sẽ luôn ở trạng thái sẵn sàng, khách hàng mở link hoặc Googlebot thu thập dữ liệu đều phản hồi ngay lập tức.

---

## Bước 5: Kiểm Tra & Kích Hoạt SEO Sau Khi Deploy

1. **Kiểm tra tệp điều hướng Crawler:**
   - Mở `https://<link-vercel-cua-ban>.vercel.app/robots.txt` → xác nhận có `Disallow: /admin` và trỏ đúng `Sitemap: .../sitemap.xml`.
   - Mở `https://<link-vercel-cua-ban>.vercel.app/sitemap.xml` → xác nhận liệt kê đầy đủ trang chủ, danh mục (`/products?category=...`) và từng sản phẩm (`/products/...`).
2. **Kiểm tra HTML SSR & Schema JSON-LD:**
   - Mở một trang sản phẩm bất kỳ `/products/<slug>`, nhấn chuột phải chọn **View Page Source** (Xem nguồn trang) → kiểm tra đã có sẵn `<title>`, `<meta name="description">`, `<link rel="canonical">`, thẻ `og:image`, và `<script type="application/ld+json">` (`Product`, `BreadcrumbList`).
   - Có thể dán link sản phẩm vào [Google Rich Results Test](https://search.google.com/test/rich-results) để kiểm tra dữ liệu có cấu trúc.
3. **Khai báo lên Google Search Console (nếu dùng cho website chính thức):**
   - Truy cập [Google Search Console](https://search.google.com/search-console), xác minh quyền sở hữu domain.
   - Vào mục **Sitemaps**, gửi đường dẫn `sitemap.xml` để Google lập chỉ mục toàn bộ danh mục và sản phẩm.

---

## Thông Tin Tài Khoản Admin Demo

- **Đường dẫn CMS:** `https://<link-vercel-cua-ban>.vercel.app/admin/login`
- **Email:** `admin@axiom.vn`
- **Mật khẩu:** `Password@123`

> **Lưu ý:** Trên Render Free, ổ đĩa là tạm thời (*ephemeral*). Toàn bộ **54 ảnh sản phẩm mẫu** nằm trên Vercel nên luôn hiển thị bình thường; riêng ảnh mới upload thêm từ Admin CMS sẽ không lưu lại sau khi container Render khởi động lại.
