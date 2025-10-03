"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MahjongListPage() {
  const [rows, setRows] = useState<any[][]>([]);
  useEffect(() => {
    fetch("/api/mahjong/list")
      .then(res => res.json())
      .then(data => setRows(data.values || []));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">麻雀戦績一覧</h1>
        <Link href="/mahjong/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          + 新規戦績
        </Link>
      </div>

      <table className="border-collapse border w-full">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className="border px-2 py-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
