"use client";
import { useEffect, useState } from "react";

type PlayerStats = {
  name: string;
  games: number;
  totalScore: number;
  totalRank: number;
  topCount: number;
  lastCount: number;
};

export default function MahjongStats() {
  const [rows, setRows] = useState<string[][]>([]);
  const [filter, setFilter] = useState<"ALL" | "東" | "南">("ALL");

  const players = ["Daich1", "Hamupetit", "nakapixis", "つばちゃんだよ"];

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/mahjong/list"); // 新規APIにすると楽
      const data = await res.json();
      setRows(data.rows || []);
    }
    fetchData();
  }, []);

  // データフィルタリング
  const filtered = rows.slice(1).filter((row) => {
    if (filter === "ALL") return true;
    return row[1] === filter; // row[1] は タイプ列
  });

  // 集計処理
  const stats: Record<string, PlayerStats> = {};
  players.forEach((p) => {
    stats[p] = {
      name: p,
      games: 0,
      totalScore: 0,
      totalRank: 0,
      topCount: 0,
      lastCount: 0,
    };
  });

  filtered.forEach((row) => {
    // row = [日付, タイプ, P1点, P1順位, P2点, P2順位, P3点, P3順位, P4点, P4順位, コメント]
    players.forEach((p, i) => {
      const score = Number(row[2 + i * 2]) || 0;
      const rank = Number(row[3 + i * 2]) || 0;
      const st = stats[p];
      st.games += 1;
      st.totalScore += score;
      st.totalRank += rank;
      if (rank === 1) st.topCount += 1;
      if (rank === 4) st.lastCount += 1;
    });
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-6">麻雀成績集計</h1>

      {/* フィルタ切替 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded ${filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          全体
        </button>
        <button
          onClick={() => setFilter("東")}
          className={`px-4 py-2 rounded ${filter === "東" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          東風戦
        </button>
        <button
          onClick={() => setFilter("南")}
          className={`px-4 py-2 rounded ${filter === "南" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          半荘戦
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">プレイヤー</th>
            <th className="p-2 border">対局数</th>
            <th className="p-2 border">平均順位</th>
            <th className="p-2 border">トップ率</th>
            <th className="p-2 border">ラス回避率</th>
            <th className="p-2 border">平均持ち点</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => {
            const st = stats[p];
            const avgRank = st.games ? (st.totalRank / st.games).toFixed(2) : "-";
            const topRate = st.games ? ((st.topCount / st.games) * 100).toFixed(1) + "%" : "-";
            const lasAvoid = st.games ? (((st.games - st.lastCount) / st.games) * 100).toFixed(1) + "%" : "-";
            const avgScore = st.games ? Math.round(st.totalScore / st.games) : "-";

            return (
              <tr key={p}>
                <td className="p-2 border text-center">{p}</td>
                <td className="p-2 border text-center">{st.games}</td>
                <td className="p-2 border text-center">{avgRank}</td>
                <td className="p-2 border text-center">{topRate}</td>
                <td className="p-2 border text-center">{lasAvoid}</td>
                <td className="p-2 border text-center">{avgScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
