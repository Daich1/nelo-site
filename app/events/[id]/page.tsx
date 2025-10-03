"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type GFile = { id: string; name: string };

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [preview, setPreview] = useState<GFile[]>([]);

  // 仮データ（本番はDB連携予定）
  const event = {
    id,
    title: "夏合宿",
    date: "2025-08-09",
    place: "熱海",
    description: "チーム合宿でBBQと観光！",
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/drive/list?eventId=${id}`);
      const data = await res.json();
      const files: GFile[] = (data.files || []).slice(0, 3);
      setPreview(files);
    })();
  }, [id]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600">{event.date} / {event.place}</p>
      <p className="mt-4">{event.description}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">アルバムプレビュー</h2>
        {preview.length === 0 ? (
          <p className="text-gray-500">まだ写真がありません</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {preview.map((f) => (
              <img
                key={f.id}
                src={`/api/drive/file/${f.id}`}
                alt={f.name}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        )}
        <Link
          href={`/events/${id}/album`}
          className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          アルバムをもっと見る
        </Link>
      </section>
    </main>
  );
}
