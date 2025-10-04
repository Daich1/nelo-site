"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  folderId: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events/list");
        const data = await res.json();
        console.log("events/list response:", data); // ✅ デバッグ
        setEvents(data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  if (events.length === 0) return <p>イベントがありません。</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>
      <div className="grid gap-4">
        {events.map(ev => (
          <Link key={ev.id} href={`/events/${ev.id}`}>
            <div className="border rounded-lg p-4 shadow bg-white/80 hover:bg-gray-100 cursor-pointer">
              <h2 className="font-bold text-lg">{ev.title}</h2>
              <p className="text-sm text-gray-600">{ev.date} @ {ev.location}</p>
              <p className="text-sm text-blue-600">{ev.type}</p>
              <p className="mt-2 text-gray-800 line-clamp-2">{ev.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
