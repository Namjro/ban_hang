---
name: AXIOM Industrial Design System
version: 1.0.0
colors:
  primary: "#0b132b"
  primary-dark: "#050914"
  secondary: "#152039"
  accent: "#f59e0b"
  accent-hover: "#d97706"
  accent-light: "#fef3c7"
  neutral-bg: "#f8fafc"
  surface: "#ffffff"
  border-light: "#dce2ea"
  border-dark: "#475569"
  text-primary: "#0b132b"
  text-inverted: "#ffffff"
  text-muted: "#475569"
  text-dim: "#94a3b8"
  text-subtle: "#e8edf3"
  status-success: "#10b981"
  status-warning: "#f59e0b"
  status-danger: "#ef4444"
typography:
  fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
  h1:
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.04em
  h2:
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.035em
  h3:
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.02em
  h4:
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontSize: 1rem
    lineHeight: 1.65
  body-md:
    fontSize: 0.875rem
    lineHeight: 1.6
  caption:
    fontSize: 0.75rem
    lineHeight: 1.5
  overline:
    fontSize: 0.6875rem
    fontWeight: 600
    letterSpacing: 0.1em
    textTransform: uppercase
rounded:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 72px
  6xl: 96px
elevation:
  card: "0 1px 3px 0 rgba(11, 19, 43, 0.08), 0 1px 2px -1px rgba(11, 19, 43, 0.08)"
  modal: "0px 18px 20px rgba(11, 19, 43, 0.15)"
  dropdown: "0 10px 15px -3px rgba(11, 19, 43, 0.1), 0 4px 6px -4px rgba(11, 19, 43, 0.1)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
    hoverBackgroundColor: "{colors.accent-hover}"
    rounded: "{rounded.sm}"
    height: "50px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border-light}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 16px"
  input-default:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border-light}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    fontSize: "14px"
  badge-assurance:
    backgroundColor: "{colors.secondary}"
    borderColor: "{colors.border-dark}"
    textColor: "{colors.text-subtle}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

## Overview
Hệ thống thiết kế **AXIOM Industrial Supply** phục vụ nền tảng cung ứng máy móc cơ khí, dụng cụ cắt gọt chính xác CNC và vật tư công nghiệp nặng. Phong cách hướng tới sự chính xác, độ tin cậy cơ khí cao, loại bỏ các chi tiết trang trí thừa thãi và tập trung tối đa vào thông số kỹ thuật (SKU, dung sai, tiêu chuẩn CO/CQ).

## Colors
- **Primary Navy (`#0b132b`)**: Đại diện cho sự bền vững của máy móc cơ khí, kết cấu thép và uy tín công nghiệp nặng.
- **Secondary Dark Navy (`#152039`)**: Sử dụng làm nền các thẻ chứng nhận (Assurance badges), container phụ trên nền tối.
- **Accent Amber (`#f59e0b`)**: Màu vàng cam an toàn cơ khí (Industrial Amber). Sử dụng dứt khoát cho các hành động trọng yếu: *Yêu Cầu Báo Giá*, *Tải Catalogue*, *Đặt hàng*.
- **Neutral Background (`#f8fafc`)**: Tạo độ dịu mắt cho các trang danh mục sản phẩm có mật độ thông tin kỹ thuật cao.
- **Borders (`#dce2ea` / `#475569`)**: Đường viền cơ khí sắc nét 1px tạo cấu trúc bảng biểu spec và khối form rõ ràng.

## Typography
- Toàn bộ giao diện sử dụng font **Inter** hỗ trợ đầy đủ tiếng Việt.
- **Overline (`11px` / uppercase / tracking `1.6px`)**: Đánh dấu số thứ tự danh mục hoặc phạm vi danh mục (`01 / DANH MỤC THIẾT BỊ`, `03 / KHO HÀNG & NĂNG LỰC`).
- **Heading 1 (`48px` / Extrabold)**: Thông điệp giá trị cốt lõi tại Hero.
- **Spec Typography**: Các mã SKU và thông số kỹ thuật hiển thị bằng trọng số SemiBold rõ nét.

## Layout & Spacing
- Container chính cố định `1440px` với padding ngang tiêu chuẩn `72px` trên Desktop (`px-[72px]`), `24px` trên Tablet và `16px` trên Mobile.
- Khoảng cách giữa các section: `64px` - `96px` tạo nhịp điệu thoáng đãng nhưng liền mạch.
- Lưới sản phẩm: 3 cột trên Desktop lớn, 2 cột trên Tablet, 1 cột trên Mobile.

## Elevation & Depth
- Hạn chế đổ bóng mềm mại kiểu ứng dụng tiêu dùng. Ưu tiên đường viền cơ khí (`border-solid border 1px`).
- Đối với Modal liên hệ: Sử dụng bóng đổ trọng lượng cao `drop-shadow-[0px_18px_20px_rgba(11,19,43,0.15)]` kết hợp `backdrop-blur-[3px]` trên nền tối `rgba(11, 19, 43, 0.6)`.

## Shapes
- Bo góc đồng bộ `4px` (`rounded-[4px]`) cho tất cả các nút bấm, input, thẻ badge nhằm mô phỏng góc bo kim loại chính xác của chi tiết máy.
- Bo góc `8px` (`rounded-[8px]`) cho các khối container lớn (Card sản phẩm, Modal liên hệ, Khung form B2B).

## Components
- **Precision Mark**: Biểu tượng lục giác cơ khí AXIOM viền kép 2px.
- **Quote Request Form**: Form B2B gồm 2 cột thông tin liên hệ và ô nhập SKU/thông số cần tìm, kèm cam kết bảo mật.
- **Filter Sidebar**: Thanh lọc nhiều cấp có thể thu gọn, đếm số lượng SKU trong kho.
- **Spec Table Matrix**: Bảng hiển thị thông số vật liệu, độ cứng, dung sai với các đường phân cách mỏng.

## Do's and Don'ts
### Do's:
- Giữ nguyên mã màu `#0b132b` và `#f59e0b` làm trục nhận diện chính.
- Sử dụng thuật ngữ kỹ thuật chính xác: CO/CQ, SKU, Dung sai, CNC, Carbide.
- Hiển thị đầy đủ trạng thái tương tác: default, hover, active, focus-visible và disabled.

### Don'ts:
- Không sử dụng bo tròn hoàn toàn (pill) trừ các chip đếm số lượng nhỏ.
- Không dùng màu nền gradient sặc sỡ hoặc bóng mờ quá dày.
- Không để ảnh bị méo tỷ lệ; luôn dùng `object-cover` hoặc `object-contain` trong khung kỹ thuật.
