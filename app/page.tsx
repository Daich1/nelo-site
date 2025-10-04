"use client";
export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e]">
        <div className="text-white text-xl">ログインしてください</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] text-white p-10">
      <h1 className="text-4xl font-extrabold mb-6 text-[#f0558b] drop-shadow-lg">
        Nelo Portal
      </h1>
      <p className="text-lg mb-10">
        ようこそ、<span className="font-bold text-[#00d4ff]">{session.user?.name}</span> さん！
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/events">
          <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:scale-105 hover:shadow-[#0042a1]/50 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#0042a1]">Events</h2>
            <p className="text-gray-300 mt-2">イベントの予定と詳細を確認</p>
          </div>
        </Link>

        <Link href="/announcements">
          <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:scale-105 hover:shadow-[#f0558b]/50 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#f0558b]">Announcements</h2>
            <p className="text-gray-300 mt-2">最新のお知らせをチェック</p>
          </div>
        </Link>

        <Link href="/albums">
          <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:scale-105 hover:shadow-[#00d4ff]/50 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#00d4ff]">Albums</h2>
            <p className="text-gray-300 mt-2">イベント写真をアルバムで共有</p>
          </div>
        </Link>

        <Link href="/schedule">
          <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:scale-105 hover:shadow-[#42ff91]/50 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#42ff91]">Schedule</h2>
            <p className="text-gray-300 mt-2">年間スケジュールを確認</p>
          </div>
        </Link>

        <Link href="/diary">
          <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:scale-105 hover:shadow-[#ffaa00]/50 transition cursor-pointer">
            <h2 className="text-2xl font-bold text-[#ffaa00]">Diary</h2>
            <p className="text-gray-300 mt-2">みんなの日記を投稿</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
