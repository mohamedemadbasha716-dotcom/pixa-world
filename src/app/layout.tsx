import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminInit from "@/components/AdminInit";
import GlobalReturnFix from "./components/GlobalReturnFix";
import AddToHomeScreen from "@/app/components/AddToHomeScreen"; // 🆕 استيراد بوب أب الإضافة للشاشة

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🆕 إعدادات الميتا داتا الجديدة اللي بتعرف الموبايل إن ده أبلكيشن (PWA)
export const metadata: Metadata = {
  title: "Pixa World - تعلم الألمانية",
  description: "تطبيق تفاعلي لتعلم اللغة الألمانية بطريقة ممتعة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pixa World",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07090D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminInit /> {/* هيشتغل في كل الصفحات */}
        <GlobalReturnFix /> {/* يظبط كل الدروس تلقائي - يرجع لنفس الخريطة */}
        
        {children}
        
        <AddToHomeScreen /> {/* 🆕 البوب أب بتاع تثبيت المنصة على الموبايل */}
      </body>
    </html>
  );
}