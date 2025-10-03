"use client";

import Link from "next/link";

export default function HomePage() {
  const items = [
    { title: "イベント", href: "/events" },
    { title: "お知らせ", href: "/announcements" },
    { title: "日記", href: "/diary" },
    { title: "アルバム", href: "/albums" },
    { title: "麻雀戦績", href: "/mahjong" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a2a] to-[#001d40] text-white flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide mb-4">
          <span className="text-[#0042a1] drop-shadow-[0_0_15px_#0042a1]">Nelo</span>{" "}
          <span className="text-[#f0558b] drop-shadow-[0_0_15px_#f0558b]">Portal</span>
        </h1>
        <p className="text-gray-300 text-lg">
          チームの活動を一元管理する eSports ダッシュボード
        </p>
      </div>

      {/* Grid menu */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-10 text-center border border-[#0042a1]/50 hover:border-[#f0558b] hover:shadow-[0_0_30px_#f0558b] transition transform hover:-translate-y-2">
              <h2 className="text-2xl font-bold group-hover:text-[#f0558b] transition">
                {item.title}
              </h2>
              <p className="text-sm text-gray-400 mt-2">→ {item.title} へ移動</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
