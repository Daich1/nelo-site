import { NextResponse } from "next/server";
import { driveClient, ensureEventFolder } from "@/lib/drive";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const eventId = String(form.get("eventId") ?? "");
    const title = (form.get("title") as string) || "";

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    const files = form.getAll("files") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const folderId = await ensureEventFolder(eventId, title);
    const drive = driveClient("https://www.googleapis.com/auth/drive.file");

    const results: { name: string; id: string }[] = [];
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      const res = await drive.files.create({
        requestBody: { name: file.name, parents: [folderId] },
        media: {
          mimeType: file.type || "application/octet-stream",
          body: buf as any,   // 👈 型エラー回避
        },
        fields: "id, name",
      });
      results.push({ name: res.data.name!, id: res.data.id! });
    }

    return NextResponse.json({ ok: true, uploaded: results, folderId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
