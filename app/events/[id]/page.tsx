import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function EventPage({ params }: { params: { id: string } }) {
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !event)
    return <p className="text-center mt-20 text-gray-500">イベントが見つかりません。</p>;

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500 mb-6">
        {event.date && <>📅 {event.date}　</>}
        {event.location && <>📍 {event.location}　</>}
        {event.type && <>🗂️ {event.type}</>}
      </p>
      {event.description && (
        <p className="text-gray-600 text-center max-w-3xl mb-6 whitespace-pre-wrap">
          {event.description}
        </p>
      )}
      <iframe
        src={`https://drive.google.com/embeddedfolderview?id=${event.folderId}#grid`}
        className="w-full max-w-5xl h-[80vh] border-0 rounded-xl shadow-lg"
      />
    </div>
  );
}
