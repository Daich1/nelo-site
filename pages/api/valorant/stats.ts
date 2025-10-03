import React, { useEffect, useMemo, useState } from "react";
<h3 className="font-semibold">{activePlayer} のサマリー</h3>
<div className="grid grid-cols-2 gap-3">
<StatCard title="試合数" value={active.summary.games} />
<StatCard title="勝率" value={`${Math.round(active.summary.winRate*100)}%`} />
<StatCard title="勝ち" value={active.summary.wins} />
<StatCard title="負け" value={active.summary.losses} />
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


{/* 右：全体のマップ別・エージェント別（比較用） */}
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