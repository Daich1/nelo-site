"use client";
import { useState } from "react";

export default function NewEventForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/events/create", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (res.ok) {
      setMsg("イベントを作成しました！");
      (e.target as HTMLFormElement).reset();
    } else {
      setMsg("エラーが発生しました");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold">イベント作成</h1>

      <input name="title" placeholder="タイトル" className="input" required />
      <input name="date" type="date" className="input" required />
      <input name="location" placeholder="場所" className="input" />

      <select name="type" className="input" required>
        <option value="Trip">旅行</option>
        <option value="Match">試合</option>
        <option value="Practice">練習</option>
        <option value="Meetup">集まり</option>
      </select>

      <input name="summary" placeholder="サマリー (短い説明)" className="input" />
      <textarea name="description" placeholder="詳細説明" className="input" />

      <button type="submit" disabled={loading} className="btn">
        {loading ? "作成中..." : "作成"}
      </button>

      {msg && <p>{msg}</p>}
    </form>
  );
}
