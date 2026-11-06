import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXIOM — Nhà Cung Cấp Máy Móc Công Nghiệp & Dụng Cụ Cơ Khí Chính Xác",
  description: "Duy trì sản xuất liên tục. Cung cấp máy móc tin cậy, dụng cụ chính xác và phụ tùng thay thế từ một đối tác kỹ thuật duy nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-[#0b132b]">
        {children}
      </body>
    </html>
  );
}
