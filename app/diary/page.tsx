"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DiaryListPage() {
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
      fetch("/api/diary/list")
        .then((res) => res.json())
        .then((data) => setRows(data.values || []));
    }
  }, [status]);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">日記一覧</h1>
        {session?.user?.role === "Admin" && (
          <Link
            href="/diary/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + 新規日記
          </Link>
        )}
      </div>

      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="border p-3 rounded bg-white">
            <Link
              href={`/diary/${r[0]}`}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {r[1]}
            </Link>
            <div className="text-sm text-gray-500">{r[3]}</div>
            <p className="text-sm mt-1">{r[2]?.slice(0, 50)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
