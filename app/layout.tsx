"use client";
export const dynamic = "force-dynamic";

import "./globals.css";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_JP } from "next/font/google";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = {
  title: "Nelo Portal",
  description: "Nelo公式ポータルサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${noto.className} bg-gradient-to-br from-[#001f3f] via-[#002f6c] to-[#000814] text-white min-h-screen`}
      >
        {/* 🩵 NextAuthのSessionを全ページで有効にする */}
        <SessionProvider>
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/10">
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl text-white hover:text-[#f0558b] transition"
              >
                <img src="/logo.png" alt="Nelo" className="w-8 h-8 rounded-lg" />
                Nelo
              </Link>

              <div className="flex gap-6 text-sm sm:text-base">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/events">Events</NavLink>
                <NavLink href="/schedule">Schedule</NavLink>
                <NavLink href="/diary">Diary</NavLink>
                <NavLink href="/stats">Stats</NavLink>
              </div>
            </nav>
          </header>

          <main className="pt-8 pb-16 px-4 sm:px-8">{children}</main>

          <footer className="text-center text-sm text-gray-400 py-6 border-t border-white/10 mt-12">
            © 2025 Nelo Portal. All rights reserved.
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-white/80 hover:text-[#f0558b] transition font-medium"
    >
      {children}
    </Link>
  );
}
