"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Diary = {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
};

export default function DiaryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [diary, setDiary] = useState<Diary | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role === "Guest") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDiary = async () => {
      const res = await fetch(`/api/getDiary?id=${id}`);
      const data = await res.json();
      setDiary(data);
    };
    fetchDiary();
  }, [id]);

  if (status === "loading" || !diary) return <p className="text-center py-10">読み込み中…</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{diary.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {diary.date} by {diary.author}
      </p>
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: diary.content }}
      />
      <div className="mt-10">
        <Link href="/diary" className="text-[#0042a1] hover:underline">
          ← 一覧に戻る
        </Link>
      </div>
    </div>
  );
}
