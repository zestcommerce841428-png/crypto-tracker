import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Box from "@mui/material/Box";
import "./globals.css";
import Providers from "@/theme/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ScrollToTop from "@/components/common/ScrollToTop";
import { siteUrl } from "@/lib/utils/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CryptoTracker — Live Crypto Prices, Charts & Portfolio Tracker",
    template: "%s | CryptoTracker",
  },
  description:
    "Track real-time cryptocurrency prices, market cap, charts, portfolio performance and news for 10,000+ coins. Fast, free, and always up to date.",
  keywords: [
    "crypto tracker",
    "cryptocurrency prices",
    "bitcoin price",
    "ethereum price",
    "crypto portfolio tracker",
    "crypto market cap",
    "crypto news",
  ],
  applicationName: "CryptoTracker",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    siteName: "CryptoTracker",
    title: "CryptoTracker — Live Crypto Prices, Charts & Portfolio Tracker",
    description:
      "Track real-time cryptocurrency prices, market cap, charts, portfolio performance and news for 10,000+ coins.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoTracker — Live Crypto Prices, Charts & Portfolio Tracker",
    description:
      "Track real-time cryptocurrency prices, market cap, charts, portfolio performance and news for 10,000+ coins.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafd" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
            <Navbar />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <Footer />
            <MobileBottomNav />
            <ScrollToTop />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
