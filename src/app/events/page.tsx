import Link from "next/link";
import { listEvents } from "@/lib/data";


export default async function EventsPage(){
const events = await listEvents();
const byMonth = events.reduce<Record<string, typeof events>>((acc, e)=>{
const k = e.date.slice(0,7);
(acc[k] ||= []).push(e);
return acc;
}, {});


const months = Object.keys(byMonth).sort();


return (
<div className="space-y-6">
<h1 className="text-2xl font-semibold">Events</h1>
<div className="space-y-8">
{months.map(m => (
<section key={m} className="space-y-3">
<h2 className="text-lg font-semibold">{m}</h2>
<div className="grid md:grid-cols-3 gap-4">
{byMonth[m].map(ev => (
<Link key={ev.slug} href={`/events/${ev.slug}`} className="card hover:shadow-md transition">
<div className="flex items-center justify-between">
<div>
<div className="font-medium">{ev.title}</div>
<div className="text-sm text-neutral-500">{ev.date}</div>
</div>
<div className="text-xs px-2 py-1 rounded-xl bg-brand-primary text-white">{ev.type}</div>
</div>
<p className="text-sm mt-3 text-neutral-600 line-clamp-2">{ev.summary}</p>
</Link>
))}
</div>
</section>
))}
</div>
</div>
);
}