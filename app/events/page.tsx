import Link from "next/link";
import Image from "next/image";
import { listEvents } from "@/lib/data";
import { listDriveImages } from "@/lib/googleDrive";

export default async function EventsPage() {
  const events = await listEvents();

  // 先に画像をまとめて取得
  const withThumbs = await Promise.all(
    events.map(async (ev) => {
      const imgs = await listDriveImages(ev.folderId);
      return { ...ev, thumb: imgs[0]?.url || null };
    })
  );

  // 月ごとにグループ化
  const byMonth: Record<string, typeof withThumbs> = {};
  for (const e of withThumbs) {
    const k = e.date.slice(0, 7);
    (byMonth[k] ||= []).push(e);
  }
  const months = Object.keys(byMonth).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">イベント一覧</h1>
      <div className="space-y-8">
        {months.map((m) => (
          <section key={m} className="space-y-3">
            <h2 className="text-lg font-semibold">{m}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {byMonth[m].map((ev) => (
                <Link
                  key={ev.slug}
                  href={`/events/${ev.slug}`}
                  className="card hover:shadow-md transition"
                >
                  <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-neutral-100">
                    {ev.thumb && (
                      <Image
                        src={ev.thumb}
                        alt={ev.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-sm text-neutral-500">{ev.date}</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
