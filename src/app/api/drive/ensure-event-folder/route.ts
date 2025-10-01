import { NextRequest, NextResponse } from "next/server";
import { EnsureEventFolderBody } from "@/types/drive";

export async function POST(req: NextRequest) {
  let body: EnsureEventFolderBody;
  try {
    body = (await req.json()) as EnsureEventFolderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventId, title } = body;
  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  // ここは実プロジェクトのDrive連携に合わせて置き換え
  // 例: 既存の service.ensureEventFolder(eventId, title)
  const folder = {
    id: `folder_${eventId}`,
    name: title ?? `event_${eventId}`,
    mimeType: "application/vnd.google-apps.folder",
  };

  return NextResponse.json({ folder });
}
