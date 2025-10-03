"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type DriveFile = { id: string; name: string; thumbnailLink?: string };

export default function AlbumPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // アルバム取得
  useEffect(() => {
    fetch(`/api/events/${eventId}/album/list`)
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []));
  }, [eventId]);

  // アップロード処理
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>("input[type=file]");
    if (!fileInput?.files?.length) return;

    const formData = new FormData();
    formData.append("eventId", eventId!);
    for (const file of fileInput.files) {
      formData.append("files", file);
    }

    setUploading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/album/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "upload failed");
      alert("アップロード完了");
      setShowModal(false);
      setFiles((prev) => [...prev, ...data.uploaded]); // 即時反映
    } catch (e: any) {
      alert("エラー: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">アルバム</h1>
        {session?.user?.role === "Admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + 画像追加
          </button>
        )}
      </div>

      {/* 画像一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((f) => (
          <div key={f.id} className="border rounded p-2">
            {f.thumbnailLink ? (
              <img
                src={f.thumbnailLink}
                alt={f.name}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="h-40 flex items-center justify-center bg-gray-100">
                No Preview
              </div>
            )}
            <div className="text-sm mt-1">{f.name}</div>
          </div>
        ))}
      </div>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">画像を追加</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input type="file" name="files" multiple accept="image/*" />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                >
                  {uploading ? "アップロード中..." : "アップロード"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
