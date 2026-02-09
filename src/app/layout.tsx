import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finlowly - Kişisel Finans Dashboard",
  description: "Gelir ve gider planlaması için profesyonel, sade ve kullanıcı dostu finansal dashboard",
  keywords: ["Finlowly", "Kişisel Finans", "Gelir Gider", "Dashboard", "Finansal Planlama"],
  authors: [{ name: "Finlowly Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Finlowly - Kişisel Finans Dashboard",
    description: "Gelir ve gider planlaması için profesyonel finansal dashboard",
    url: "https://chat.z.ai",
    siteName: "Finlowly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finlowly - Kişisel Finans Dashboard",
    description: "Gelir ve gider planlaması için profesyonel finansal dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
