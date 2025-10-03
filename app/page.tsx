"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="text-white">読み込み中...</p>;
  if (!session) redirect("/signin");

  const menuItems = [
    { title: "Events", desc: "イベントの予定と詳細を確認", href: "/events" },
    { title: "Announcements", desc: "最新のお知らせをチェック", href: "/announcements" },
    { title: "Albums", desc: "イベント写真をアルバムで共有", href: "/albums" },
    { title: "Schedule", desc: "年間スケジュールを確認", href: "/schedule" },
    { title: "Diary", desc: "みんなの日記を投稿", href: "/diary" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-center px-6 py-12 text-white">
      {/* ヘッダー */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-wide mb-4">
          Nelo<span className="text-[#f0558b]"> Portal</span>
        </h1>
        <p className="text-lg text-gray-300">
          ようこそ、<span className="font-bold text-[#0042a1]">{session.user?.name}</span> さん！
        </p>
      </header>

      {/* メニューカード */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {menuItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg transition transform hover:-translate-y-2 hover:shadow-[#0042a1]/40 cursor-pointer">
              <h2 className="text-2xl font-bold mb-3 text-[#f0558b]">{item.title}</h2>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
