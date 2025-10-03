"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#0042a1] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側メニュー */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-lg hover:text-[#f0558b]">Nelo</Link>
            <Link href="/schedule" className="hover:text-[#f0558b]">年間スケジュール</Link>
            <Link href="/events" className="hover:text-[#f0558b]">イベント</Link>
            <Link href="/announcements" className="hover:text-[#f0558b]">お知らせ</Link>
            <Link href="/diary" className="hover:text-[#f0558b]">日記</Link> {/* ← 追加 */}
          </div>

          {/* 右側（ログイン状態） */}
          <div>
            {session ? (
              <div className="flex items-center space-x-4">
                <span>{session.user.name} ({session.user.role})</span>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 bg-[#f0558b] rounded hover:bg-pink-600"
                >
                  サインアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="px-3 py-1 bg-[#f0558b] rounded hover:bg-pink-600"
              >
                サインイン
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
