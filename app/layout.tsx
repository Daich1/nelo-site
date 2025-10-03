import "./globals.css"; // ← これを必ず入れる
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
