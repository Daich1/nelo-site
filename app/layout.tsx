import "./globals.css";
import type { ReactNode } from "react";
import SessionWrapper from "./session-wrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
