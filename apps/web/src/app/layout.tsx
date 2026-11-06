import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { VipToastProvider } from "../components/common/VipToast";
import AppShell from "../components/layout/AppShell";

export const metadata: Metadata = {
  title: "TechCore - Siêu thị Thiết bị Công nghệ, Laptop Gaming & Linh kiện PC",
  description: "Hệ thống bán lẻ thiết bị công nghệ hàng đầu Việt Nam. Laptop Gaming, Macbook, iPhone, Card màn hình RTX, Bàn phím cơ chính hãng 100%.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-[#F7FBFD] text-[#001C44] antialiased selection:bg-[#2D99AE] selection:text-white">
        <CartProvider>
          <VipToastProvider>
            <AppShell>{children}</AppShell>
          </VipToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
