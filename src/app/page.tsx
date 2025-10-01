"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nelo Hub</h1>

      {session ? (
        <p>ようこそ、{session.user?.name} さん（権限: {(session.user as any).role}）</p>
      ) : (
        <p>ログインしてください</p>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-semibold">お知らせ</h2>
        <p>※ここに最新のお知らせを表示予定</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">直近のイベント</h2>
        <p>※ここに直近イベントを表示予定</p>
      </section>
    </main>
  );
}
