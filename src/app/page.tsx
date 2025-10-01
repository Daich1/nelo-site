"use client";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hello Nelo 🚀</h1>
      </main>
    </AuthGuard>
  );
}
