import Link from "next/link";

type HomeStat = {
  label: string;
  value: number | string;
};

export default function HomePage() {
  const stats: HomeStat[] = [
    { label: "イベント数", value: 1 },
    { label: "写真", value: "3+" },
  ];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Nelo 内部サイト</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-4 border">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <Link href="/events" className="underline">
          イベント一覧へ
        </Link>
      </div>
    </main>
  );
}
