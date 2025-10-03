"use client";
import { useState } from "react";

export default function MahjongAddPage() {
  const [values, setValues] = useState(["", "", "", "", "", ""]);

  const handleChange = (i: number, val: string) => {
    const copy = [...values];
    copy[i] = val;
    setValues(copy);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/mahjong/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row: values }),
    });
    const data = await res.json();
    if (data.ok) alert("追加しました！");
    else alert("エラー: " + data.error);
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">麻雀戦績を追加</h1>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {values.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            className="border p-2"
            placeholder={`Col ${i + 1}`}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        登録
      </button>
    </div>
  );
}
