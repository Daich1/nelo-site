"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";   // ✅ 追加
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  folderId: string;
}

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession(); // ✅ useSession を利用
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        // イベント詳細取得
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (res.ok) setEvent(data.event);

        // アルバム写真取得
        const resPhotos = await fetch(`/api/events/${id}/photos`);
        const dataPhotos = await resPhotos.json();
        if (resPhotos.ok) setPhotos(dataPhotos.photos);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const onDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;
    try {
      const res = await fetch("/api/events/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("削除しました");
        router.push("/events");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!event) return <p>イベントが見つかりませんでした。</p>;

  return (
    <div className="p-6">
      {/* イベント情報 */}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">
        {event.date} @ {event.location}
      </p>
      <p className="text-blue-600 mb-6">{event.type}</p>
      <p className="whitespace-pre-line">{event.description}</p>

      {/* アルバム表示 */}
      {photos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">📸 アルバム</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={p.thumbnailLink}
                  alt={p.name}
                  width={200}
                  height={200}
                  className="rounded shadow"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Admin 専用ボタン */}
      {session?.user && (session.user as any).role === "Admin" && (
        <div className="mt-6 flex gap-3">
          <Link
            href={`/events/${event.id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            編集
          </Link>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
