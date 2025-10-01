"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DriveFile } from "@/types/drive";

type EventData = {
  id: string;
  title: string;
  date: string;
  place: string;
  description?: string;
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [preview, setPreview] = useState<DriveFile[]>([]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/drive/list?eventId=${id}&pageSize=3`);
    if (!res.ok) return;
    const data: { files: DriveFile[] } = await res.json();
    setPreview(data.files);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const event: EventData = {
    id: String(id),
    title: "夏合宿",
    date: "2025-08-09",
    place: "熱海",
    description: "チーム合宿でBBQと観光！",
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {event.date} / {event.place}
      </p>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">プレビュー（最新3件）</h2>
        <div className="flex gap-3">
          {preview.map((f) => (
            <div key={f.id} className="relative w-40 h-40 rounded-xl overflow-hidden">
              <Image
                src={`/api/drive/thumbnail?id=${f.id}`}
                alt={f.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <Link
        href={`/events/${event.id}/album`}
        className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white"
      >
        アルバムへ
      </Link>
    </main>
  );
}
