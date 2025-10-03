"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Diary = {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
};

export default function DiaryListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role === "Guest") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const res = await fetch("/api/getDiaries");
      const data = await res.json();
      setDiaries(data);
    };
    fetchDiaries();
  }, []);

  if (status === "loading") return <p className="text-center py-10">認証中…</p>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">日記一覧</h1>

      {session?.user.role === "Admin" && (
        <div className="mb-6">
          <Link
            href="/diary/new"
            className="px-4 py-2 bg-[#0042a1] text-white rounded hover:bg-[#003080]"
          >
            ✍ 新しい日記を書く
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {diaries.map((d) => (
          <Link key={d.id} href={`/diary/${d.id}`}>
            <div className="bg-white/90 rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{d.title}</h2>
              <p className="text-sm text-gray-500">{d.date} by {d.author}</p>
              <div
                className="mt-3 text-gray-700 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: d.content }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
