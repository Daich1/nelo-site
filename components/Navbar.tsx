"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-[#0042a1]/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側ロゴ */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-wide text-[#0042a1] hover:text-[#f0558b] drop-shadow-[0_0_8px_#0042a1] transition"
            >
              Nelo
            </Link>

            <Link href="/schedule" className="nav-link">スケジュール</Link>
            <Link href="/events" className="nav-link">イベント</Link>
            <Link href="/announcements" className="nav-link">お知らせ</Link>
            <Link href="/diary" className="nav-link">日記</Link>
            <Link href="/mahjong" className="nav-link">麻雀</Link>
          </div>

          {/* 右側 ユーザー */}
          <div>
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 rounded-lg bg-[#f0558b] hover:bg-pink-600 text-white font-bold transition shadow-[0_0_10px_#f0558b]"
                >
                  サインアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="px-3 py-1 rounded-lg bg-[#0042a1] hover:bg-[#0057d9] text-white font-bold transition shadow-[0_0_10px_#0042a1]"
              >
                Discordでログイン
              </button>
            )}
          </div>
        </div>
      </div>

      {/* カスタムスタイル */}
      <style jsx>{`
        .nav-link {
          color: #ccc;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: #f0558b;
          text-shadow: 0 0 10px #f0558b;
        }
      `}</style>
    </nav>
  );
}
