import fs from "fs/promises";
import path from "path";

async function getEvent(id: string) {
  const filePath = path.join(process.cwd(), "data", "events.json");
  try {
    const json = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(json);
    return events.find((e: any) => e.id === id);
  } catch {
    return null;
  }
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500">
        イベントが見つかりません。
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {/* Google Drive フォルダ埋め込み */}
      <iframe
        src={`https://drive.google.com/embeddedfolderview?id=${event.folderId}#grid`}
        className="w-full max-w-5xl h-[80vh] border-0 rounded-xl shadow-lg"
      />
    </div>
  );
}
