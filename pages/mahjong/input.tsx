"use client";
import { useState } from "react";

export default function MahjongInput() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [gameType, setGameType] = useState("南");
  const [scores, setScores] = useState(["", "", "", ""]);
  const [ranks, setRanks] = useState(["", "", "", ""]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const players = ["Daich1", "Hamupetit", "nakapixis", "つばちゃんだよ"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/mahjong/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, gameType, scores, ranks, comment }),
    });

    if (res.ok) {
      setMessage("戦績を追加しました ✅");
      setScores(["", "", "", ""]);
      setRanks(["", "", "", ""]);
      setComment("");
    } else {
      setMessage("追加に失敗しました ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">麻雀戦績入力</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>日付</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>対局タイプ</label>
          <select value={gameType} onChange={(e) => setGameType(e.target.value)}
            className="w-full border p-2 rounded">
            <option value="東">東風戦</option>
            <option value="南">半荘戦</option>
          </select>
        </div>
        {players.map((player, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              <label>{player} 持ち点</label>
              <input
                type="number"
                value={scores[i]}
                onChange={(e) => {
                  const newScores = [...scores];
                  newScores[i] = e.target.value;
                  setScores(newScores);
                }}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-20">
              <label>順位</label>
              <input
                type="number"
                min="1"
                max="4"
                value={ranks[i]}
                onChange={(e) => {
                  const newRanks = [...ranks];
                  newRanks[i] = e.target.value;
                  setRanks(newRanks);
                }}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        ))}
        <div>
          <label>コメント</label>
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          追加
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
