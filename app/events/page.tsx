"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EventsPage() {
  const { data: session, status } = useSession();
  const { data: events, error } = useSWR("/api/events/list", fetcher);

  if (status === "loading") {
    return <div className="text-center text-gray-300 mt-20">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#0a0a1a] to-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#f0558b] drop-shadow-[0_0_8px_#f0558b]">
            このページを閲覧するにはログインが必要です
          </h2>
          <Link
            href="/signin"
            className="inline-block mt-6 px-6 py-3 bg-[#0042a1] hover:bg-[#0057d9] text-white font-bold rounded-lg shadow-[0_0_10px_#0042a1] transition"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">データの取得に失敗しました。</div>;
  }

  if (!events) {
    return <div className="text-center text-gray-300 mt-20">イベントを読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a1a] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0042a1] drop-shadow-[0_0_8px_#0042a1]">
            イベント一覧
          </h1>
          {session?.user?.role === "Admin" && (
            <Link
              href="/events/create"
              className="px-5 py-3 bg-[#f0558b] hover:bg-[#ff6fa3] text-white font-bold rounded-xl shadow-[0_0_12px_#f0558b] transition"
            >
              + イベント作成
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-400">現在予定されているイベントはありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="bg-black/60 border border-[#0042a1]/50 rounded-2xl p-6 shadow-lg hover:shadow-[0_0_20px_#f0558b] transition transform hover:-translate-y-2"
              >
                <h2 className="text-xl font-bold text-[#f0558b] mb-2 drop-shadow-[0_0_6px_#f0558b]">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-400 mb-1">📅 {event.date}</p>
                <p className="text-sm text-gray-400 mb-3">📍 {event.location}</p>
                <p className="text-gray-300 text-sm line-clamp-3">{event.description}</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/events/${event.id}`}
                    className="px-4 py-2 rounded-lg bg-[#0042a1] hover:bg-[#0057d9] text-white text-sm font-bold shadow-[0_0_10px_#0042a1] transition"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
