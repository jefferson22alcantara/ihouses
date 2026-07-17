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
  themeColor: "#4f46e5",
  colorScheme: "dark",
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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <RegisterServiceWorker />
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur">
          <nav className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold tracking-tight text-white">
              Ihouses
            </span>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-slate-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/alerts" className="text-slate-300 hover:text-white">
                Alerts
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
