import "./globals.css";
import { Providers } from "./providers";
import type { ReactNode } from "react";

export const metadata = {
  title: "Nelo Portal",
  description: "Neloのポータルサイト",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
