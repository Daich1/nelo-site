"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EventAlbumPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "Guest";

  // 仮データ
  const photos = [
    "/photo1.jpg",
    "/photo2.jpg",
    "/photo3.jpg",
    "/photo4.jpg",
    "/photo5.jpg",
  ];

  if (role === "Guest") {
    return <p className="p-6">このアルバムは非公開です。ログインしてください。</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">アルバム - イベント {id}</h1>

      {(role === "Admin" || role === "Nelo") && (
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          写真アップロード
        </button>
      )}

      <div className="grid grid-cols-4 gap-2">
        {photos.map((src, idx) => (
          <img key={idx} src={src} alt={`photo-${idx}`} className="w-full h-32 object-cover rounded" />
        ))}
      </div>
    </main>
  );
}
