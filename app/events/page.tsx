import Link from "next/link";
import { listEventsFromSheet } from "@/lib/sheets";

export default async function EventsPage() {
  const events = await listEventsFromSheet();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>
      {events.length === 0 ? (
        <p className="text-neutral-500">まだイベントはありません。</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.slug} className="border rounded-lg p-4 bg-white/70 shadow">
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-neutral-500">
                {event.date} / {event.location} / {event.type}
              </p>
              <p className="mt-2">{event.summary}</p>
              <Link href={`/events/${event.slug}`} className="mt-3 inline-block text-blue-600 hover:underline">
                詳細を見る
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
