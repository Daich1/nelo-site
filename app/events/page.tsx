import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// 🔹 イベント型定義
type EventData = {
  id: string;
  title: string;
  folder_id: string;
  created_at: string;
};

// 🔹 Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function EventsPage() {
  // Supabaseからデータ取得
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  // エラーハンドリング
  if (error) {
    console.error("Supabase取得エラー:", error);
    return (
      <div className="text-center text-red-600 mt-20">
        取得中にエラーが発生しました。
      </div>
    );
  }

  // データがない場合
  if (!events || events.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">イベント一覧</h1>
        <p className="text-gray-500 mb-8">まだイベントが登録されていません。</p>
        <Link
          href="/events/create"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          ＋ イベントを作成
        </Link>
      </div>
    );
  }

  // 正常表示
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">イベント一覧</h1>

      {/* 🔹 イベントカード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event: EventData) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block border border-gray-300 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition p-4 bg-white/90"
          >
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-sm text-gray-500">
              作成日: {new Date(event.created_at).toLocaleString("ja-JP")}
            </p>
            <div className="mt-3 text-blue-600 font-medium">▶ アルバムを見る</div>
          </Link>
        ))}
      </div>

      {/* 🔹 イベント作成リンク */}
      <div className="text-center mt-10">
        <Link
          href="/events/create"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          ＋ イベントを作成
        </Link>
      </div>
    </div>
  );
}
