"use client";
import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";

export default function MahjongAddPage() {
  const [row, setRow] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const onChange = (i: number, v: string) => {
    const copy = [...row];
    copy[i] = v;
    setRow(copy);
  };

  const onSubmit = async () => {
    if (!row[0]) {
      alert("日付は必須です");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/mahjong/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      alert("戦績を追加しました");
    } catch (e: any) {
      alert("エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <h1 className="font-bold text-2xl mb-4">麻雀戦績追加 (Admin専用)</h1>
      <div className="grid grid-cols-3 gap-2 max-w-2xl">
        {["日付(YYYY-MM-DD)", "半荘番号", "東家", "南家", "西家", "北家"].map((p, i) => (
          <input key={i} className="border p-2 rounded" placeholder={p} value={row[i]} onChange={e=>onChange(i, e.target.value)} />
        ))}
      </div>
      <button disabled={loading} onClick={onSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
        {loading ? "追加中..." : "追加"}
      </button>
    </AdminGuard>
  );
}
