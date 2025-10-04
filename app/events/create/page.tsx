"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, folderId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage(`✅ イベント「${title}」を作成しました！`);
      setTitle("");
      setFolderId("");
    } else {
      setMessage(`❌ エラー: ${data.error}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">イベント作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">イベント名</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：夏合宿2025"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Google Drive フォルダID</label>
          <input
            type="text"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：1ABCDefghijklmnOP"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            DriveフォルダURLが
            <code> https://drive.google.com/drive/folders/1ABCDefghijklmnOP </code>
            の場合、<b>1ABCDefghijklmnOP</b> 部分を入力。
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "作成中..." : "作成"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
