"use client";
import React from "react";

type Props = {
  activePlayer: string;
  active: { summary: { games: number; winRate: number } };
};

export default function ValorantStats({ activePlayer, active }: Props) {
  return (
    <div>
      <h3 className="font-semibold">{activePlayer} のサマリー</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard title="試合数" value={active.summary.games} />
        <StatCard
          title="勝率"
          value={`${Math.round(active.summary.winRate * 100)}%`}
        />
      </div>
    </div>
  );
}

// サマリー表示用の小カード
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-3 border rounded shadow-sm bg-white/70">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
