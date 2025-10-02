import "./globals.css";
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";


export const metadata = {
title: "N - Nelo",
description: "Nelo internal site"
};


export default function RootLayout({ children }: { children: ReactNode }){
return (
<html lang="ja" suppressHydrationWarning>
<body className="min-h-screen bg-neutral-50 text-neutral-900">
<Providers>
<div className="mx-auto max-w-6xl px-4">
<Navbar />
<main className="py-6">{children}</main>
</div>
</Providers>
</body>
</html>
);
}