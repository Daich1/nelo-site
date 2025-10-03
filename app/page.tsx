"use client";

import RequireAuth from "@/components/RequireAuth";

export default function HomePage() {
  return (
    <RequireAuth>
      <div className="p-8">
        <h1 className="text-2xl font-bold">ホーム</h1>
        <p>ここはログイン後にのみ表示されます。</p>
      </div>
    </RequireAuth>
  );
}