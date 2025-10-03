import { getEventBySlug } from "@/lib/sheets";
import { listFolderImages } from "@/lib/drive";

interface Props {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-bold text-red-600">イベントが見つかりません</h1>
      </div>
    );
  }

  const images = event.folderId ? await listFolderImages(event.folderId, 3) : [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-sm text-neutral-500">
        {event.date} / {event.location} / {event.type}
      </p>

      <p className="text-lg">{event.summary}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">詳細</h2>
        <p className="whitespace-pre-wrap">{event.description}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">アルバム</h2>
        {event.folderId ? (
          <>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <a key={img.id} href={img.link} target="_blank" rel="noopener noreferrer">
                    <img src={img.thumbnail} alt={img.name} className="rounded-lg shadow hover:opacity-80 transition" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500">まだ写真がありません。</p>
            )}
            <a
              href={`https://drive.google.com/drive/folders/${event.folderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline"
            >
              Google Drive フォルダを開く
            </a>
          </>
        ) : (
          <p className="text-neutral-500">アルバムはまだ登録されていません。</p>
        )}
      </section>
    </div>
  );
}
