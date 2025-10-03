import "./globals.css";
import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Nelo Site",
  description: "Internal tools",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
