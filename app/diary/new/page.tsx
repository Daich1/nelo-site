"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DiaryEditor from "@/components/DiaryEditor";
import { useSession } from "next-auth/react";

export default function NewDiaryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "Admin") {
      router.push("/diary");
    }
  }, [session, status, router]);

  const handleSave = async (content: string) => {
    const res = await fetch("/api/saveDiary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      alert("日記を保存しました！");
      router.push("/diary");
    } else {
      alert("保存に失敗しました");
    }
  };

  if (status === "loading") return <p className="text-center py-10">認証中…</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">新しい日記を書く</h1>
      <input
        className="border w-full mb-4 p-2 rounded"
        placeholder="タイトルを入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <DiaryEditor onSave={handleSave} />
    </div>
  );
}
