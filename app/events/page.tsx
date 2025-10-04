"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type EventData = {
  id?: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  folder_id: string;
  created_at?: string;
};

// 🔹 Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventData | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
    description: "",
    folderId: "",
  });

  // イベント取得
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("取得エラー:", error.message);
    else setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // モーダル制御
  const openCreateModal = () => {
    setEditing(null);
    setForm({
      title: "",
      date: "",
      location: "",
      type: "",
      description: "",
      folderId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventData) => {
    setEditing(event);
    setForm({
      title: event.title || "",
      date: event.date || "",
      location: event.location || "",
      type: event.type || "",
      description: event.description || "",
      folderId: event.folder_id || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  // 入力変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 作成 or 更新
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      const { error } = await supabase
        .from("events")
        .update({
          title: form.title,
          date: form.date,
          location: form.location,
          type: form.type,
          description: form.description,
          folder_id: form.folderId,
        })
        .eq("id", editing.id);
      if (error) alert("更新失敗: " + error.message);
    } else {
      const { error } = await supabase.from("events").insert([
        {
          title: form.title,
          date: form.date,
          location: form.location,
          type: form.type,
          description: form.description,
          folder_id: form.folderId,
        },
      ]);
      if (error) alert("作成失敗: " + error.message);
    }

    closeModal();
    fetchEvents();
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) alert("削除失敗: " + error.message);
    else fetchEvents();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">イベント管理</h1>

      {/* 追加ボタン */}
      <div className="text-right mb-6">
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ＋ イベントを作成
        </button>
      </div>

      {/* イベント一覧 */}
      {loading ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">まだイベントがありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 rounded-xl shadow hover:shadow-lg transition p-4 bg-white/90"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              {event.date && <p className="text-gray-500">📅 {event.date}</p>}
              {event.location && <p className="text-gray-500">📍 {event.location}</p>}
              {event.type && <p className="text-gray-500">🗂️ {event.type}</p>}
              {event.description && (
                <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
              )}

              {/* ✅ Driveフォルダ対応部分 */}
              <div className="mt-3 space-y-2">
                {event.folder_id ? (
                  <>
                    <a
                      href={`https://drive.google.com/drive/folders/${event.folder_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 font-medium hover:underline"
                    >
                      📂 Driveフォルダを開く
                    </a>
                    <a
                      href={`/events/${event.id}`}
                      className="block text-blue-500 font-medium hover:underline"
                    >
                      ▶ アルバムを見る
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => openEditModal(event)}
                    className="text-pink-600 font-medium hover:underline"
                  >
                    ⚠️ Driveフォルダ未登録 — 登録する
                  </button>
                )}
              </div>

              {/* 編集・削除 */}
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openEditModal(event)}
                  className="text-yellow-600 font-medium hover:underline"
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={() => handleDelete(event.id!)}
                  className="text-red-600 font-medium hover:underline"
                >
                  🗑️ 削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {editing ? "✏️ イベント編集" : "＋ イベント作成"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <Input label="タイトル" name="title" value={form.title} onChange={handleChange} required />
              <Input label="日付" name="date" type="date" value={form.date} onChange={handleChange} />
              <Input label="場所" name="location" value={form.location} onChange={handleChange} />
              <Input label="種別" name="type" value={form.type} onChange={handleChange} />
              <Textarea label="説明" name="description" value={form.description} onChange={handleChange} />
              <Input
                label="Google Drive フォルダID"
                name="folderId"
                value={form.folderId}
                onChange={handleChange}
              />

              {/* Driveフォルダリンク */}
              {form.folderId && (
                <a
                  href={`https://drive.google.com/drive/folders/${form.folderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 text-sm hover:underline text-center"
                >
                  📂 Driveフォルダを開く
                </a>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editing ? "更新" : "作成"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 共通部品
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
