"use client";
import { useEffect, useState } from "react";

type FileItem = {
  eventId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  url: string;
  uploadedAt: string;
};

export default function AlbumPage({ params }: { params: { id: string } }) {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    fetch(`/api/events/${params.id}/album`)
      .then((res) => res.json())
      .then(setFiles);
  }, [params.id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">イベントアルバム</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file) =>
          file.mimeType.startsWith("image/") ? (
            <img
              key={file.fileId}
              src={file.url}
              alt={file.fileName}
              className="w-full h-48 object-cover rounded-lg shadow"
            />
          ) : (
            <video
              key={file.fileId}
              src={file.url}
              controls
              className="w-full h-48 object-cover rounded-lg shadow"
            />
          )
        )}
      </div>
    </div>
  );
}
