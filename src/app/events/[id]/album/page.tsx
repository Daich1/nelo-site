"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

type GFile = { id: string; name: string };

export default function EventAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const role = session?.user.role ?? "Guest";

  const [files, setFiles] = useState<GFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const dropRef = useRef<HTMLDivElement>(null);

  async function refresh() {
    const res = await fetch(`/api/drive/list?eventId=${id}`);
    const data = await res.json();
    setFiles((data.files ?? []) as GFile[]);
  }

  useEffect(() => {
    void refresh();
  }, [id]);

  // Drag & Drop
  useEffect(() => {
    if (!dropRef.current) return;

    const div = dropRef.current;

    function onDragOver(e: DragEvent) {
      e.preventDefault();
      div.classList.add("border-blue-500");
    }

    function onDragLeave(e: DragEvent) {
      e.preventDefault();
      div.classList.remove("border-blue-500");
    }

    async function onDrop(e: DragEvent) {
      e.preventDefault();
      div.classList.remove("border-blue-500");

      if (!e.dataTransfer?.files.length) return;

      setLoading(true);
      try {
        const form = new FormData();
        form.append("eventId", String(id));
        form.append("title", "");
        Array.from(e.dataTransfer.files).forEach((f) =>
          form.append("files", f)
        );

        const res = await fetch("/api/drive/upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error ?? "アップロードに失敗しました");
        } else {
          await refresh();
        }
      } finally {
        setLoading(false);
      }
    }

    div.addEventListener("dragover", onDragOver);
    div.addEventListener("dragleave", onDragLeave);
    div.addEventListener("drop", onDrop);

    return () => {
      div.removeEventListener("dragover", onDragOver);
      div.removeEventListener("dragleave", onDragLeave);
      div.removeEventListener("drop", onDrop);
    };
  }, [id]);

  if (role === "Guest") {
    return (
      <p className="p-6 text-center text-gray-500">
        このアルバムは非公開です。ログインしてください。
      </p>
    );
  }

  const canUpload = role === "Admin" || role === "Nelo";

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">アルバム - イベント {id}</h1>

      {/* ドラッグ&ドロップエリア */}
      {canUpload && (
        <div
          ref={dropRef}
          className="mb-6 p-6 border-2 border-dashed border-gray-400 rounded-lg text-center text-gray-500 hover:bg-gray-50 transition"
        >
          {loading ? "アップロード中..." : "ここに写真をドラッグ＆ドロップ"}
        </div>
      )}

      {/* グリッド */}
      {files.length === 0 ? (
        <p className="text-gray-500">写真がまだありません</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {files.map((f, idx) => (
            <div key={f.id} className="relative group">
              <img
                src={`/api/drive/file/${f.id}`}
                alt={f.name}
                className="w-full h-48 object-cover rounded cursor-pointer"
                onClick={() => setModalIndex(idx)}
              />
              {role === "Admin" && (
                <button className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-70 hover:opacity-100">
                  削除
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* モーダル */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalIndex(null)}
        >
          <button
            className="absolute top-1/2 left-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex((prev) =>
                prev && prev > 0 ? prev - 1 : files.length - 1
              );
            }}
          >
            ◀
          </button>
          <img
            src={`/api/drive/file/${files[modalIndex].id}`}
            alt={files[modalIndex].name}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded"
          />
          <button
            className="absolute top-1/2 right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex((prev) =>
                prev !== null && prev < files.length - 1 ? prev + 1 : 0
              );
            }}
          >
            ▶
          </button>
        </div>
      )}
    </main>
  );
}
