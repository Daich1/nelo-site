import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { AlbumGrid } from "@/components/album/AlbumGrid";
import { listDriveImages } from "@/lib/googleDrive";

export default async function EventDetail({ params }: { params: { slug: string }}) {
  const ev = await getEventBySlug(params.slug);
  if (!ev) return notFound();

  const user = await getCurrentUser();
  const images = await listDriveImages(ev.folderId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{ev.title}</h1>
      <div className="text-sm text-neutral-500">{ev.date} ・ {ev.location}</div>

      <p className="text-neutral-700">{ev.description}</p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">アルバム（最新3枚）</h2>
       <AlbumGrid
  images={images.slice(0,3).map(i => i.url)}
  role={user?.role ?? "Guest"} 
/>

        <p className="text-sm text-neutral-500">※ アルバム全体はこのイベントページからのみ閲覧可能です</p>
      </section>
    </div>
  );
}
