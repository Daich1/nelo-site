"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events/list");
        const data = await res.json();
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">イベント一覧</h1>
        {session?.user?.role === "Admin" && (
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            イベント作成
          </Link>
        )}
      </div>

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
