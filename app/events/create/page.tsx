"use client";
import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function EventCreatePage() {
  const [form, setForm] = useState({ id: "", title: "", date: "", description: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const onSubmit = async () => {
    if (!form.id || !form.title) {
      alert("ID と Title は必須です");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      alert(`作成しました（DriveFolder: ${data.folderId}）`);
    } catch (e: any) {
      alert("エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <h1 className="font-bold text-2xl mb-4">イベント作成 (Admin専用)</h1>
      <div className="grid gap-3 max-w-xl">
        <input className="border p-2 rounded" placeholder="Event ID" value={form.id} onChange={e=>onChange("id", e.target.value)} />
        <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={e=>onChange("title", e.target.value)} />
        <input type="date" className="border p-2 rounded" value={form.date} onChange={e=>onChange("date", e.target.value)} />
        <textarea className="border p-2 rounded min-h-[120px]" placeholder="Description" value={form.description} onChange={e=>onChange("description", e.target.value)} />
        <button disabled={loading} onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? "作成中..." : "作成"}
        </button>
      </div>
    </AdminGuard>
  );
}
