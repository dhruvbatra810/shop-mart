import type { Metadata, Viewport } from "next";
import { auth } from '@/lib/auth'
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from '@/lib/contexts/sessionProvider'
import "./globals.css";
import ThemeProvider from "@/lib/contexts/themeProvider";
import WebVitals from "@/lib/webvitals";
import { GoogleAnalytics } from "@/lib/analytic";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopSmart",
  description: "Shop smarter — browse and buy products with ShopSmart.",
};

export const viewport: Viewport = {
  themeColor: "#18181b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-full h-full">
       <ThemeProvider>
        <SessionProvider session={session}>
          <GoogleAnalytics/>
          <WebVitals/>
          <ServiceWorkerRegister/>
          <InstallPrompt/>
        {children}
       </SessionProvider>
       </ThemeProvider>
       </body>
    </html>
  );
}
