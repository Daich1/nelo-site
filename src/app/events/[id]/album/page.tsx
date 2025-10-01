"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type GFile = { id: string; name: string };

export default function EventAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const role = session?.user.role ?? "Guest";

  const [files, setFiles] = useState<GFile[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const res = await fetch(`/api/drive/list?eventId=${id}`);
    const data = await res.json();
    setFiles((data.files ?? []) as GFile[]);
  }

  useEffect(() => {
    void refresh();
  }, [id]);

  if (role === "Guest") {
    return <p className="p-6">このアルバムは非公開です。ログインしてください。</p>;
  }

  const canUpload = role === "Admin" || role === "Nelo";

  async function onUploadSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("eventId", String(id));
      form.append("title", "");
      Array.from(files).forEach((f) => form.append("files", f));

      const res = await fetch("/api/drive/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "アップロードに失敗しました");
      } else {
        await refresh();
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">アルバム - イベント {id}</h1>
        {canUpload && (
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onUploadSelected}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {loading && <p className="text-sm text-gray-500 mb-2">アップロード中...</p>}

      {files.length === 0 ? (
        <p className="text-gray-500">写真がまだありません</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {files.map((f) => (
            // <img> の警告はWarningなのでこのままでOK（必要なら next/image に差し替え）
            <img
              key={f.id}
              src={`/api/drive/file/${f.id}`}
              alt={f.name}
              className="w-full h-40 object-cover rounded"
            />
          ))}
        </div>
      )}
    </main>
  );
}
