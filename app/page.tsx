// app/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b] text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b] flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-12 max-w-xl w-full text-center">
        {/* ユーザー情報 */}
        <h1 className="text-3xl font-bold text-[#0042a1]">
          ようこそ、{session.user?.name} さん 👋
        </h1>
        <p className="mt-2 text-gray-600">ここはログイン後にのみ表示されます。</p>

        {/* ユーザーアイコン */}
        {session.user?.image && (
          <div className="flex justify-center my-6">
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-[#f0558b]"
            />
          </div>
        )}

        {/* ボタン */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/events")}
            className="px-6 py-3 rounded-full bg-[#0042a1] text-white font-semibold shadow hover:bg-[#003080] transition"
          >
            イベント一覧
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="px-6 py-3 rounded-full bg-[#f0558b] text-white font-semibold shadow hover:bg-pink-600 transition"
          >
            ログアウト
          </button>
        </div>
      </div>
    </main>
  );
}
