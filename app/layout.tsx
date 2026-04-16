import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ImageProtect from "./components/ImageProtect";
import ScrollToTop from "./components/ScrollToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "혜빈 ❤️ 재환 결혼합니다.",
  description:
    "혜빈과 재환의 결혼식에 초대합니다. 2026년 5월 31일 일요일 오전 11시 30분 | 라루체 명동 5F 그레이스홀",
  openGraph: {
    title: "혜빈 ❤️ 재환 결혼합니다.",
    description:
      "2026년 5월 31일 일요일 오전 11시 30분 | 라루체 명동 5F 그레이스홀",
    images: [
      {
        url: "/images/original/hyebin_01.jpeg",
        width: 1200,
        height: 630,
        alt: "혜빈 & 재환 청첩장",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overscroll-none">
        <ScrollToTop />
        <ImageProtect />
        <div className="w-full max-w-[430px] mx-auto min-h-full flex flex-col flex-1 shadow-2xl overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
