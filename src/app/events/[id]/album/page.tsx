"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { DriveFile } from "@/types/drive";

export default function EventAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<DriveFile[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/drive/list?eventId=${id}&pageSize=48`);
      if (!res.ok) return;
      const data: { files: DriveFile[] } = await res.json();
      if (!cancelled) setFiles(data.files);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">アルバム</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {files.map((f) => (
          <div key={f.id} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg"
              alt={f.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
