"use client";
import { useEffect, useState } from "react";

export default function MahjongListPage() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mahjong/list")
      .then((res) => res.json())
      .then((data) => {
        setRows(data.values || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">麻雀戦績一覧</h1>
      <div className="overflow-x-auto">
        <table className="border-collapse border min-w-[600px]">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border px-3 py-2 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
