import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Kanit } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Kob Store | E-Commerce Workshop",
    template: "%s | E-Commerce Workshop",
  },
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าไอทีครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
};

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={kanit.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
