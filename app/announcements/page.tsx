"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<any[][]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/announcements/list")
        .then((res) => res.json())
        .then((data) => setRows(data.values || []));
    }
  }, [status]);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">お知らせ一覧</h1>
        {session?.user?.role === "Admin" && (
          <Link href="/announcements/create" className="bg-blue-600 text-white px-4 py-2 rounded">
            + 新規お知らせ
          </Link>
        )}
      </div>

      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="border p-3 rounded bg-white">
            <div className="font-semibold">{r[1]}</div>
            <div className="text-sm text-gray-500">{r[3]}</div>
            <p>{r[2]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
