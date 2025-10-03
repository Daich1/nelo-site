import React from "react";


type Props = { title: string; value: string | number; sub?: string };
export default function StatCard({ title, value, sub }: Props) {
return (
<div className="rounded-2xl shadow-lg p-5 bg-white/90 border border-slate-100">
<div className="text-xs text-slate-500">{title}</div>
<div className="text-2xl font-bold">{value}</div>
{sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
</div>
);
}