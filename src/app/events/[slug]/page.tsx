import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { AlbumGrid } from "@/components/album/AlbumGrid";


export default async function EventDetail({ params }: { params: { slug: string }}){
const ev = await getEventBySlug(params.slug);
if(!ev) return notFound();
const user = await getCurrentUser();


return (
<div className="space-y-6">
<div className="flex items-start justify-between gap-4">
<div>
<h1 className="text-2xl font-semibold">{ev.title}</h1>
<div className="text-sm text-neutral-500">{ev.date} ・ {ev.location}</div>
</div>
<span className="text-xs px-2 py-1 rounded-xl bg-brand-accent text-white h-min">{ev.type}</span>
</div>


<p className="text-neutral-700">{ev.description}</p>


<section className="space-y-3">
<h2 className="text-lg font-semibold">Album (latest 3)</h2>
<AlbumGrid images={ev.images.slice(0,3)} role={user.role} />
<p className="text-sm text-neutral-500">* Full album is accessible **only from this event page** (no separate Albums page per latest design).</p>
</section>
</div>
);
}