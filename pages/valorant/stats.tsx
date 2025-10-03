import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import StatCard from "@/components/StatCard";
import WinRateBar from "@/components/WinRateBar";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

// API レスポンス型
interface APIAgg {
  overall: { player: string; games: number; wins: number; losses: number; draws: number; winRate: number; }[];
  players: Record<string, {
    summary: { player: string; games: number; wins: number; losses: number; draws: number; winRate: number };
    byAgent: Record<string, { plays: number; wins: number }>;
    byMap: Record<string, { plays: number; wins: number }>;
  }>;
  maps: Record<string, { plays: number; wins: number }>;
  agents: Record<string, { plays: number; wins: number }>;
  sides: Record<string, { plays: number; wins: number }>;
  totals: { games: number; wins: number; losses: number; draws: number; winRate: number };
  fullParty: { games: number; wins: number; losses: number; draws: number; winRate: number };
  daily: { date: string; games: number; wins: number; winRate: number }[];
}

export default function ValorantStatsPage(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agg, setAgg] = useState<APIAgg | null>(null);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [activePlayer, setActivePlayer] = useState<string>("");

  useEffect(() => {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    setLoading(true);
    fetch(`/api/valorant/stats?${q.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (!d.ok) throw new Error(d.error || "failed");
        setAgg(d.agg);
        setError(null);
        const first = d.agg?.overall?.[0]?.player || "";
        setActivePlayer(first);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [from, to]);

  const overallChart = useMemo(() => {
    if (!agg) return [] as any[];
    return agg.overall.map(o => ({
      player: o.player,
      勝率: Math.round(o.winRate * 100),
      試合数: o.games,
      勝ち: o.wins,
      負け: o.losses,
    }));
  }, [agg]);

  const active = agg?.players?.[activePlayer] || null;
  const agentList = useMemo(() => {
    if (!active) return [] as any[];
    return Object.entries(active.byAgent)
      .map(([label, v]) => ({ label, plays: v.plays, wins: v.wins }))
      .sort((a,b) => b.plays - a.plays)
      .slice(0, 10);
  }, [active]);

  const mapList = useMemo(() => {
    if (!active) return [] as any[];
    return Object.entries(active.byMap)
      .map(([label, v]) => ({ label, plays: v.plays, wins: v.wins }))
      .sort((a,b) => b.plays - a.plays)
      .slice(0, 10);
  }, [active]);

  const dailyData = useMemo(() => {
    if (!agg) return [] as any[];
    return agg.daily.map(d => ({ date: d.date, 勝率: Math.round(d.winRate * 100) }));
  }, [agg]);

  return (
    <>
      <Head>
        <title>Valorant 戦績集計 | Nelo</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            <span className="text-[--nelo-main]">Valorant</span> 戦績集計
          </h1>

          {/* サマリーカード群 */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="総試合数" value={agg?.totals.games ?? "-"} />
            <StatCard title="勝利" value={agg?.totals.wins ?? "-"} />
            <StatCard title="敗北" value={agg?.totals.losses ?? "-"} />
            <StatCard title="勝率" value={agg ? `${Math.round(agg.totals.winRate*100)}%` : "-"} />
            {agg?.sides && (
              <>
                <StatCard title="攻め勝率"
                  value={agg.sides["攻め"] ? `${Math.round((agg.sides["攻め"].wins / Math.max(1, agg.sides["攻め"].plays)) * 100)}%` : "-"}
                  sub={`${agg.sides["攻め"]?.wins ?? 0}/${agg.sides["攻め"]?.plays ?? 0}`} />
                <StatCard title="守り勝率"
                  value={agg.sides["守り"] ? `${Math.round((agg.sides["守り"].wins / Math.max(1, agg.sides["守り"].plays)) * 100)}%` : "-"}
                  sub={`${agg.sides["守り"]?.wins ?? 0}/${agg.sides["守り"]?.plays ?? 0}`} />
              </>
            )}
            {agg?.fullParty && (
              <StatCard title="フルパ勝率"
                value={`${Math.round(agg.fullParty.winRate * 100)}%`}
                sub={`${agg.fullParty.wins}/${agg.fullParty.games}`} />
            )}
          </div>

          {/* 期間フィルタ */}
          <div className="bg-white/90 border border-slate-100 rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div>
                <label className="text-xs text-slate-600">From</label>
                <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="block border rounded-lg px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-slate-600">To</label>
                <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="block border rounded-lg px-3 py-2"/>
              </div>
            </div>
          </div>

          {/* 全員サマリー（棒グラフ） */}
          <div className="bg-white/90 border border-slate-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">全員サマリー（勝率・試合数）</h2>
              <div className="text-xs text-slate-500">棒 = 勝率 / X軸 = プレイヤー</div>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={overallChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="player" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(v)=>`${v}%`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="勝率" fill="var(--nelo-main)" />
                  <Bar yAxisId="right" dataKey="試合数" fill="var(--nelo-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 日別勝率の折れ線 */}
          {agg?.daily && (
            <div className="bg-white/90 border border-slate-100 rounded-2xl p-4 mb-6">
              <h2 className="font-semibold mb-3">日別勝率の推移</h2>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} tickFormatter={(v)=>`${v}%`} />
                    <Tooltip formatter={(v:any)=>`${v}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="勝率" stroke="var(--nelo-main)" dot={true} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* プレイヤータブ */}
          <div className="bg-white/90 border border-slate-100 rounded-2xl p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {agg?.overall?.map(p => (
                <button
                  key={p.player}
                  onClick={()=>setActivePlayer(p.player)}
                  className={`px-3 py-1.5 rounded-full border text-sm ${activePlayer===p.player? 'bg-[--nelo-main] text-white border-[--nelo-main]':'bg-white hover:bg-slate-50'}`}
                >
                  {p.player}
                </button>
              ))}
            </div>

            {active ? (
              <div className="grid md:grid-cols-5 gap-6">
                {/* 左：プレイヤーサマリー */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h3 className="font-semibold">{activePlayer} のサマリー</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard title="試合数" value={active.summary.games} />
                      <StatCard title="勝率" value={`${Math.round(active.summary.winRate*100)}%`} />
                      <StatCard title="勝ち" value={active.summary.wins} />
                      <StatCard title="負け" value={active.summary.losses} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">よく使うエージェント Top10</h4>
                    <WinRateBar items={agentList} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">マップ別 勝率 Top10</h4>
                    <WinRateBar items={mapList} />
                  </div>
                </div>

                {/* 右：全体のマップ別・エージェント別 */}
                <div className="md:col-span-3 space-y-6">
                  <section>
                    <h3 className="font-semibold mb-2">全体：マップ別</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(agg?.maps || {})
                        .sort((a,b)=> b[1].plays - a[1].plays)
                        .slice(0,12)
                        .map(([map, v]) => (
                          <div key={map} className="border rounded-xl p-3">
                            <div className="text-sm font-medium mb-1">{map}</div>
                            <div className="text-xs text-slate-500 mb-2">{v.wins}/{v.plays}</div>
                            <div className="h-2 bg-slate-100 rounded-lg overflow-hidden">
                              <div className="h-full bg-[--nelo-accent]" style={{ width: `${(v.wins / Math.max(1,v.plays))*100}%` }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">全体：エージェント別</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(agg?.agents || {})
                        .sort((a,b)=> b[1].plays - a[1].plays)
                        .slice(0,12)
                        .map(([agent, v]) => (
                          <div key={agent} className="border rounded-xl p-3">
                            <div className="text-sm font-medium mb-1">{agent || '（未入力）'}</div>
                            <div className="text-xs text-slate-500 mb-2">{v.wins}/{v.plays}</div>
                            <div className="h-2 bg-slate-100 rounded-lg overflow-hidden">
                              <div className="h-full bg-[--nelo-main]" style={{ width: `${(v.wins / Math.max(1,v.plays))*100}%` }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="text-slate-500">プレイヤーを選択してください</div>
            )}
          </div>

          {loading && <div className="mt-6 text-slate-500">読み込み中…</div>}
          {error && <div className="mt-6 text-red-600">エラー: {error}</div>}
        </div>
      </div>
    </>
  );
}
