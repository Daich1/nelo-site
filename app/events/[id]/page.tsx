"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export default function EventDetailPage() {
  const params = useParams() as { id: string };
  const eventId = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setEvent(data);
        }
        setLoading(false);
      });
  }, [eventId]);

  if (loading) return <p>読み込み中...</p>;
  if (!event) return <p>イベントが見つかりません</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.date}</p>
      <p className="mb-8">{event.description}</p>

      <h2 className="text-xl font-semibold mb-2">アルバムプレビュー</h2>
      <p className="text-gray-500">アルバムは近日公開予定</p>
    </div>
  );
}
