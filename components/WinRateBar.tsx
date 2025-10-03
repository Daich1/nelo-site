import React from "react";


type Item = { label: string; plays: number; wins: number };


type Props = {
items: Item[];
max?: number;
};


export default function WinRateBar({ items, max }: Props) {
const mx = max || Math.max(1, ...items.map(i => i.plays));
return (
<div className="space-y-2">
{items.map((it) => {
const rate = it.plays ? it.wins / it.plays : 0;
const w = Math.round((it.plays / mx) * 100);
return (
<div key={it.label} className="">
<div className="flex justify-between text-xs text-slate-600 mb-1">
<span className="truncate mr-2">{it.label}</span>
<span>{Math.round(rate * 100)}% ({it.wins}/{it.plays})</span>
</div>
<div className="w-full h-3 bg-slate-100 rounded-xl overflow-hidden">
<div className="h-full bg-[--nelo-main]" style={{ width: `${w}%` }} />
</div>
</div>
);
})}
</div>
);
}