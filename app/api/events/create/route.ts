import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, folderId } = body;

    if (!title || !folderId) {
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "events.json");
    let events: any[] = [];

    try {
      const json = await fs.readFile(filePath, "utf-8");
      events = JSON.parse(json);
    } catch {
      events = [];
    }

    const newEvent = {
      id: `event_${Date.now()}`,
      title,
      folderId,
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(events, null, 2));

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
