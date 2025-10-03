"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type GFile = { id: string; name: string };

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<GFile[]>([]);
  const [selected, setSelected] = useState<GFile | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/drive/list?eventId=${id}`);
      const data = await res.json();
      setFiles(data.files || []);
    })();
  }, [id]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">アルバム</h1>

      {/* 写真一覧 */}
      {files.length === 0 ? (
        <p className="text-gray-500">まだ写真がありません</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {files.map((f) => (
            <img
              key={f.id}
              src={`/api/drive/file/${f.id}`}
              alt={f.name}
              className="w-full h-32 object-cover rounded cursor-pointer"
              onClick={() => setSelected(f)}
            />
          ))}
        </div>
      )}

      {/* モーダル表示 */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          <img
            src={`/api/drive/file/${selected.id}`}
            alt={selected.name}
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </main>
  );
}
