"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
};

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);

  // イベント情報を取得
  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error) console.error(error);
    else setEvent(data);
  };

  // Driveフォルダ内のファイル一覧を取得
  const fetchDriveFiles = async (folderId: string) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType+contains+'image/'or+mimeType+contains+'video/')&fields=files(id,name,mimeType,thumbnailLink,webViewLink)&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );
      const json = await res.json();
      setFiles(json.files || []);
    } catch (err) {
      console.error("Drive読み込み失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchEvent();
    };
    load();
  }, [params.id]);

  useEffect(() => {
    if (event?.folder_id) {
      fetchDriveFiles(event.folder_id);
    }
  }, [event]);

  if (!event) {
    return <p className="text-center text-gray-500 mt-10">イベントが見つかりません。</p>;
  }

  return (
    <div className="p-8 flex flex-col items-center">
      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

      {/* 日付・場所・種別 */}
      <p className="text-gray-500 mb-6">
        {event.date && <>📅 {event.date}　</>}
        {event.location && <>📍 {event.location}　</>}
        {event.type && <>🗂️ {event.type}</>}
      </p>

      {/* 詳細説明 */}
      {event.description && (
        <p className="text-gray-600 text-center max-w-3xl mb-6 whitespace-pre-wrap">
          {event.description}
        </p>
      )}

      {/* Driveギャラリー */}
      {event.folder_id ? (
        <>
          {loading ? (
            <p className="text-gray-500">📸 Google Driveの画像を読み込み中...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-400">このフォルダには画像や動画がありません。</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={
                      file.thumbnailLink ||
                      `https://drive.google.com/thumbnail?id=${file.id}`
                    }
                    alt={file.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400 mt-10">Google Driveフォルダが登録されていません。</p>
      )}
    </div>
  );
}
