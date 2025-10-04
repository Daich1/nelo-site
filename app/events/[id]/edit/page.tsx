"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ✅ useParams() に型を付与
type Params = { id: string };

export default function EventEditPage() {
  const { id } = useParams<Params>();  // ← ここで型指定
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
    description: "",
    folderId: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      if (res.ok) {
        setForm(data.event);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  const onChange = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const onSubmit = async () => {
    try {
      const res = await fetch("/api/events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      if (res.ok) {
        alert("更新しました");
        router.push(`/events/${id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">イベント編集</h1>
      <div className="grid gap-3 max-w-xl">
        <input className="border p-2 rounded" value={form.title} onChange={e=>onChange("title", e.target.value)} />
        <input type="date" className="border p-2 rounded" value={form.date} onChange={e=>onChange("date", e.target.value)} />
        <input className="border p-2 rounded" value={form.location} onChange={e=>onChange("location", e.target.value)} />
        <input className="border p-2 rounded" value={form.type} onChange={e=>onChange("type", e.target.value)} />
        <textarea className="border p-2 rounded min-h-[120px]" value={form.description} onChange={e=>onChange("description", e.target.value)} />
        <input className="border p-2 rounded" placeholder="Google Drive Folder ID" value={form.folderId} onChange={e=>onChange("folderId", e.target.value)} />
        <button onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">更新</button>
      </div>
    </div>
  );
}
