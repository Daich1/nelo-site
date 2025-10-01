import Link from "next/link";
import Image from "next/image";

type EventListItem = {
  id: string;
  title: string;
  date: string;
  place: string;
  coverId?: string;
};

export default async function EventsPage() {
  const events: EventListItem[] = [
    { id: "20250809", title: "夏合宿", date: "2025-08-09", place: "熱海", coverId: "1" },
  ];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">イベント</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <li key={ev.id}>
            <Link href={`/events/${ev.id}`} className="block rounded-2xl overflow-hidden shadow">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/placeholder.svg"
                  alt={ev.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{ev.title}</h2>
                <p className="text-sm text-gray-500">
                  {ev.date} / {ev.place}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
