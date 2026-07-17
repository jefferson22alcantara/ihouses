import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { RegisterServiceWorker } from "./register-sw";
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
  title: "Ihouses — Woningalerts NL",
  description:
    "Realtime meldingen voor huurwoningen in Nederland, met AI-gegenereerde motivatiebrieven.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ihouses",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e6003d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <RegisterServiceWorker />
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/dashboard" className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold tracking-tight text-brand">
                i
              </span>
              <span className="text-lg font-extrabold tracking-tight text-neutral-900">
                houses
              </span>
            </Link>
            <div className="flex gap-5 text-sm font-medium text-neutral-600">
              <Link href="/dashboard" className="transition-colors hover:text-brand">
                Search
              </Link>
              <Link href="/alerts" className="transition-colors hover:text-brand">
                Alerts
              </Link>
              <Link href="/profile" className="transition-colors hover:text-brand">
                Profile
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
