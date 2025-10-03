import { listAnnouncementsFromSheet } from "@/lib/sheets";

export default async function AnnouncementsPage() {
  const announcements = await listAnnouncementsFromSheet();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">お知らせ一覧</h1>
      {announcements.length === 0 ? (
        <p className="text-neutral-500">まだお知らせはありません。</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li key={a.id} className="border rounded-lg p-4 bg-white/70 shadow">
              <h2 className="text-lg font-semibold">{a.title}</h2>
              <p className="text-sm text-neutral-500">{a.date} / {a.createdBy}</p>
              <p className="mt-2">{a.summary}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">続きを読む</summary>
                <p className="mt-2 whitespace-pre-wrap">{a.content}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
