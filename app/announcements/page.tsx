import { listAnnouncements } from "@/lib/data";


export default async function Announcements(){
const items = await listAnnouncements();
return (
<div className="space-y-6">
<h1 className="text-2xl font-semibold">お知らせ</h1>
<div className="space-y-4">
{items.map(a => (
<article key={a.id} className="card">
<div className="text-sm text-neutral-500">{a.date}</div>
<h2 className="text-lg font-semibold">{a.title}</h2>
<p className="text-neutral-700">{a.body}</p>
</article>
))}
</div>
</div>
);
}