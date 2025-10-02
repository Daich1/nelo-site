import { listEvents } from "@/lib/data";


export default async function SchedulePage(){
const events = await listEvents();
const byMonth = events.reduce<Record<string, typeof events>>((acc, e)=>{
const k = e.date.slice(0,7);
(acc[k] ||= []).push(e);
return acc;
}, {});
const months = Object.keys(byMonth).sort();


return (
<div className="space-y-6">
<h1 className="text-2xl font-semibold">Annual Schedule</h1>
<div className="space-y-6">
{months.map(m => (
<div key={m} className="card">
<div className="font-semibold mb-2">{m}</div>
<ul className="text-sm space-y-1">
{byMonth[m].map(e => (
<li key={e.slug}>
<span className="mr-2">{e.date}</span>
<span className="font-medium">{e.title}</span>
<span className="ml-2 text-neutral-500">{e.location}</span>
</li>
))}
</ul>
</div>
))}
</div>
</div>
);
}