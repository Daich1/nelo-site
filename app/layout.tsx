"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
