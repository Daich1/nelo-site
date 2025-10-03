"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Diary = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function DiaryDetailPage() {
  // 型を明示して安全に取り出す
  const params = useParams() as { id: string };
  const id = params.id;

  const router = useRouter();
  const { data: session, status } = useSession();
  const [diary, setDiary] = useState<Diary | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetch(`/api/diary/${id}`)
        .then((res) => res.json())
        .then((data) => setDiary(data.diary));
    }
  }, [status, id]);

  if (status === "loading") return <div>Loading...</div>;
  if (!diary) return <div className="p-6">日記が見つかりません</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{diary.title}</h1>
      <p className="text-gray-500 mb-4">{diary.date}</p>
      <div>{diary.content}</div>
    </div>
  );
}
