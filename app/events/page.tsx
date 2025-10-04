"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      await supabase
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
    } else {
      await supabase.from("events").insert([
        {
          title: form.title,
          date: form.date,
          location: form.location,
          type: form.type,
          description: form.description,
          folder_id: form.folderId,
        },
      ]);
    }

    closeModal();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  return (
    <div className="max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">イベント一覧</h1>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-[#0042a1] to-[#f0558b] px-6 py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          ＋ 新規作成
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">読み込み中...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-400">イベントがありません。</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-sm text-gray-300">
                {event.date && <>📅 {event.date}<br /></>}
                {event.location && <>📍 {event.location}<br /></>}
                {event.type && <>🗂️ {event.type}</>}
              </p>
              {event.description && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>
              )}
              <div className="flex gap-3 mt-4 text-sm">
                <Link
                  href={`/events/${event.id}`}
                  className="text-[#f0558b] hover:underline"
                >
                  ▶ 開く
                </Link>
                <button
                  onClick={() => openEditModal(event)}
                  className="text-yellow-400 hover:underline"
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={() => handleDelete(event.id!)}
                  className="text-red-400 hover:underline"
                >
                  🗑️ 削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-full max-w-lg border border-white/20 text-white relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {editing ? "イベント編集" : "イベント作成"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3">
              <Input label="タイトル" name="title" value={form.title} onChange={handleChange} />
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

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500/40 rounded-md hover:bg-gray-500/60"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#0042a1] to-[#f0558b] rounded-md font-semibold"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#f0558b]"
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-300">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#f0558b]"
      />
    </div>
  );
}
