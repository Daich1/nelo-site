"use client";

import useSWR from "swr";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EventsPage() {
  const { data: session, status } = useSession();
  const { data, error, isLoading } = useSWR("/api/events/list", fetcher);

  if (status === "loading") return <p>読み込み中...</p>;
  if (!session) redirect("/signin");

  if (isLoading) return <div>イベントを読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold mb-6">イベント一覧</h1>
      <ul className="space-y-4">
        {data?.events?.map((e: any) => (
          <li key={e.id} className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700">
            <Link href={`/events/${e.id}`}>
              <p className="text-xl">{e.title}</p>
              <p className="text-sm text-gray-400">{e.date}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href="/events/create"
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500"
        >
          + イベント作成
        </Link>
      </div>
    </div>
  );
}
