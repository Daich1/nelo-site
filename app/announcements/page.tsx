"use client";
export const dynamic = "force-dynamic";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const { data, error, isLoading } = useSWR("/api/announcements/list", fetcher);

  if (status === "loading") return <p>読み込み中...</p>;
  if (!session) redirect("/signin");

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold mb-6">お知らせ一覧</h1>
      <ul className="space-y-4">
        {data?.announcements?.map((a: any) => (
          <li key={a.id} className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700">
            <p className="text-xl">{a.title}</p>
            <p className="text-sm text-gray-400">{a.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
