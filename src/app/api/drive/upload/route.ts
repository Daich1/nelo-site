import { NextRequest, NextResponse } from "next/server";
import { getDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";
export const maxDuration = 60; // 大きめファイルに備え延長（Vercel）

async function bufferFromFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function ensureEventFolder(eventId: string, title?: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/drive/ensure-event-folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // NEXTAUTH_URL が必要。ローカルは http://localhost:3000
    body: JSON.stringify({ eventId, title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "failed to ensure folder");
  return data.folderId as string;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const eventId = form.get("eventId")?.toString();
    const title = form.get("title")?.toString();
    if (!eventId) return NextResponse.json({ error: "eventId is required" }, { status: 400 });

    const files = form.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "no files" }, { status: 400 });
    }

    const folderId = await ensureEventFolder(eventId, title);
    const drive = getDrive();

    const uploaded: { id: string; name: string }[] = [];

    for (const file of files) {
      const buff = await bufferFromFile(file);
      const res = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: [folderId],
        },
        media: {
          mimeType: file.type || "application/octet-stream",
          body: Buffer.from(buff),
        },
        fields: "id, name",
        supportsAllDrives: true,
      });
      if (res.data.id) uploaded.push({ id: res.data.id, name: res.data.name! });
    }

    return NextResponse.json({ folderId, uploaded });
} catch (e: unknown) {
  const message =
    e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
  return NextResponse.json({ error: message }, { status: 500 });
}

}
