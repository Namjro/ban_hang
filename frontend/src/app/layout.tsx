import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AXIOM — Nhà Cung Cấp Máy Móc Công Nghiệp & Dụng Cụ Cơ Khí Chính Xác",
  description:
    "Duy trì sản xuất liên tục. Cung cấp máy móc tin cậy, dụng cụ chính xác và phụ tùng thay thế từ một đối tác kỹ thuật duy nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-canvas text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
