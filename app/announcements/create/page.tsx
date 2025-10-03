"use client";
import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function AnnouncementCreatePage() {
  const [form, setForm] = useState({ id: "", title: "", body: "", date: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const onSubmit = async () => {
    if (!form.id || !form.title) {
      alert("ID と Title は必須です");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/announcements/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      alert("お知らせを作成しました");
    } catch (e: any) {
      alert("エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <h1 className="font-bold text-2xl mb-4">お知らせ作成 (Admin専用)</h1>
      <div className="grid gap-3 max-w-xl">
        <input className="border p-2 rounded" placeholder="ID" value={form.id} onChange={e=>onChange("id", e.target.value)} />
        <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={e=>onChange("title", e.target.value)} />
        <input type="date" className="border p-2 rounded" value={form.date} onChange={e=>onChange("date", e.target.value)} />
        <textarea className="border p-2 rounded min-h-[120px]" placeholder="Body" value={form.body} onChange={e=>onChange("body", e.target.value)} />
        <button disabled={loading} onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? "作成中..." : "作成"}
        </button>
      </div>
    </AdminGuard>
  );
}
