// app/layout.tsx
// Root layout — poora app er wrapper, font loading, metadata, navbar + footer

import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── FONT LOADING ─────────────────────────────────────────────────────────────
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  preload: false, // Prevents unused font preload browser warnings
});

// ─── SEO METADATA ─────────────────────────────────────────────────────────────
// Next.js metadata API — page er title, description, OG tags
export const metadata: Metadata = {
  title: {
    default: "TechTribe — Bangladesh's IT Workplace Directory",
    template: "%s | TechTribe",
  },
  description:
    "Discover verified employee reviews, salary benchmarks, and job listings from Bangladesh's top IT firms. Powered by anonymous, OTP-verified insights.",
  keywords: [
    "Bangladesh IT companies",
    "Chittagong software companies",
    "Dhaka tech firms",
    "employee reviews Bangladesh",
    "IT salary Bangladesh",
    "tech jobs Bangladesh",
    "Glassdoor Bangladesh",
  ],
  openGraph: {
    siteName: "TechTribe",
    type: "website",
    locale: "en_BD",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Providers from "@/components/auth/Providers";

// ─── ROOT LAYOUT COMPONENT ────────────────────────────────────────────────────
// Shob page er common wrapper — Navbar, main content, Footer
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col bg-[var(--background)]">
        <Providers>
          {/* Navigation bar — shob page e common */}
          <Navbar />

          {/* Main page content — dynamic */}
          <main className="flex-1 flex flex-col w-full">{children}</main>

          {/* Footer — shob page e common */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
