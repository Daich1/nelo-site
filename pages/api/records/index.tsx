"use client";
import { useState, useEffect } from "react";

// ✅ エージェント一覧（固定）
const agents = [
  "Brimstone", "Viper", "Omen", "Astra", "Harbor",
  "Jett", "Reyna", "Phoenix", "Raze", "Neon", "Yoru",
  "Sage", "Killjoy", "Cypher", "Chamber", "Deadlock",
  "Sova", "Breach", "Skye", "KAY/O", "Fade", "Gekko", "Iso", "Clove",
  "Waylay", "Tejo", "Vyse"
];

// ✅ マップ一覧（固定）
const maps = [
  "Ascent","Bind","Haven","Split","Icebox",
  "Breeze","Fracture","Pearl","Lotus","Sunset","Abyss",
  "Corrode"
];

export default function RecordsPage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [form, setForm] = useState<any>({
    date: "", map: "", startTeam: "",
    allyScore: "", enemyScore: "", result: "",
    members: ["","","","",""], agents: ["","","","",""], memo: ""
  });
  const [records, setRecords] = useState<any[]>([]);
  const [selected, setSelected] = useState<any|null>(null);

  // 🔹 初期データ読み込み
  useEffect(() => {
    fetch("/api/players/list").then(res => res.json()).then(data => setPlayers(data.players));
    fetch("/api/records/list").then(res => res.json()).then(data => setRecords(data.records));
  }, []);

  // フォーム入力処理
  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleMemberChange = (index: number, value: string) => {
    const updated = [...form.members];
    updated[index] = value;
    setForm({ ...form, members: updated });
  };

  const handleAgentChange = (index: number, value: string) => {
    const updated = [...form.agents];
    updated[index] = value;
    setForm({ ...form, agents: updated });
  };

  // 保存処理
  const submit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/records/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("保存しました！");
    location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">戦績入力フォーム</h1>
      <form onSubmit={submit} className="space-y-4">
        {/* 日付 */}
        <input type="date" onChange={e => handleChange("date", e.target.value)} />

        {/* マップ */}
        <select onChange={e => handleChange("map", e.target.value)}>
          <option value="">マップを選択</option>
          {maps.map(m => <option key={m}>{m}</option>)}
        </select>

        {/* スタート陣営 */}
        <select onChange={e => handleChange("startTeam", e.target.value)}>
          <option value="">スタート陣営</option>
          <option>アタッカー</option>
          <option>ディフェンダー</option>
        </select>

        {/* スコア */}
        <div>
          最終スコア: 
          味方 <input type="number" onChange={e => handleChange("allyScore", e.target.value)} /> - 
          敵 <input type="number" onChange={e => handleChange("enemyScore", e.target.value)} />
        </div>

        {/* 勝敗 */}
        <select onChange={e => handleChange("result", e.target.value)}>
          <option value="">勝敗</option>
          <option>勝ち</option>
          <option>負け</option>
          <option>引き分け</option>
          <option>OT</option>
        </select>

        {/* メンバー＋エージェント 5人分 */}
        {[0,1,2,3,4].map(i => (
          <div key={i} className="flex gap-2">
            <select onChange={e => handleMemberChange(i, e.target.value)}>
              <option value="">メンバー{i+1}</option>
              {players.map(p => <option key={p}>{p}</option>)}
              <option value="その他">その他</option>
            </select>
            {form.members[i] === "その他" && (
              <input type="text" placeholder="名前入力"
                onChange={e => handleMemberChange(i, e.target.value)} />
            )}
            <select onChange={e => handleAgentChange(i, e.target.value)}>
              <option value="">エージェント</option>
              {agents.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        ))}

        {/* メモ */}
        <textarea placeholder="メモ" onChange={e => handleChange("memo", e.target.value)} />

        {/* 保存ボタン */}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          保存
        </button>
      </form>

      {/* 戦績一覧 */}
      <h2 className="text-lg font-bold mt-8">戦績一覧</h2>
      <table className="table-auto border-collapse border mt-2 w-full">
        <thead>
          <tr>
            <th className="border px-2">日付</th>
            <th className="border px-2">マップ</th>
            <th className="border px-2">スコア</th>
            <th className="border px-2">勝敗</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r,i) => (
            <tr key={i} className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelected(r)}>
              <td className="border px-2">{r[0]}</td>
              <td className="border px-2">{r[1]}</td>
              <td className="border px-2">{r[3]} - {r[4]}</td>
              <td className="border px-2">{r[5]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* モーダル（PC向け） */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-2">試合詳細</h3>
            <p>📅 {selected[0]}</p>
            <p>🗺 マップ: {selected[1]}</p>
            <p>🎭 スタート陣営: {selected[2]}</p>
            <p>📊 スコア: {selected[3]} - {selected[4]}</p>
            <p>🏆 勝敗: {selected[5]}</p>

            <div className="mt-2">
              <p className="font-bold">👥 メンバーとエージェント</p>
              {[0,1,2,3,4].map(i => (
                <p key={i}>
                  - {selected[6 + i*2]} : {selected[7 + i*2]}
                </p>
              ))}
            </div>

            <p className="mt-2">📝 {selected[16]}</p>

            <button onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
