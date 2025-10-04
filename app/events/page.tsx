import fs from "fs/promises";
import path from "path";
import Link from "next/link";

async function getEvents() {
  const filePath = path.join(process.cwd(), "data", "events.json");
  try {
    const json = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(json);
    return events.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">イベント一覧</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">まだイベントがありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block border border-gray-300 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition p-4 bg-white/90"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm text-gray-500">
                作成日: {new Date(event.createdAt).toLocaleString("ja-JP")}
              </p>
              <div className="mt-3 text-blue-600 font-medium">▶ アルバムを見る</div>
            </Link>
          ))}
        </div>
      )}

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
