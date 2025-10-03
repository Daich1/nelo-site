"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EventsPage() {
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
      fetch("/api/events/list")
        .then((res) => res.json())
        .then((data) => setRows(data.values || []));
    }
  }, [status]);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">イベント一覧</h1>
        {session?.user?.role === "Admin" && (
          <Link href="/events/create" className="bg-blue-600 text-white px-4 py-2 rounded">
            + 新規イベント
          </Link>
        )}
      </div>

      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">タイトル</th>
            <th className="border p-2">日付</th>
            <th className="border p-2">詳細</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border p-2">{r[0]}</td>
              <td className="border p-2">{r[1]}</td>
              <td className="border p-2">{r[2]}</td>
              <td className="border p-2">
                <Link href={`/events/${r[0]}`} className="text-blue-600 underline">
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
