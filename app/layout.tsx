import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/lib/auth";
import SyncBadge from "@/components/SyncBadge";

export const metadata: Metadata = {
  title: "캐나다 서부 로드트립",
  description: "Vancouver → Calgary 10박 11일 여정",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Canada Trip" },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <div className="mx-auto max-w-md min-h-screen flex flex-col bg-white shadow-sm relative">
            <SyncBadge />
            <main className="flex-1 pb-20">{children}</main>
            <BottomNav />
          </div>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{})); }`,
          }}
        />
      </body>
    </html>
  );
}
