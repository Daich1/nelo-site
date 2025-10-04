"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
    description: "",
    folderId: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage(`✅ イベント「${form.title}」を作成しました！`);
      setForm({ title: "", date: "", location: "", type: "", description: "", folderId: "" });
    } else {
      setMessage(`❌ エラー: ${data.error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">イベント作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="イベント名" name="title" value={form.title} onChange={handleChange} required />
        <Input label="日付" name="date" type="date" value={form.date} onChange={handleChange} />
        <Input label="場所" name="location" value={form.location} onChange={handleChange} />
        <Input label="種別" name="type" value={form.type} onChange={handleChange} />
        <Textarea label="詳細" name="description" value={form.description} onChange={handleChange} />
        <Input
          label="Google Drive フォルダID"
          name="folderId"
          value={form.folderId}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "作成中..." : "作成"}
        </button>
      </form>

      {message && <p className="mt-6 text-center">{message}</p>}
    </div>
  );
}

// 🔹 共通UI部品
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
        rows={4}
        className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
