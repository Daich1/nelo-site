import { NextRequest, NextResponse } from "next/server";
import { EnsureEventFolderBody } from "@/types/drive";

export async function POST(req: NextRequest) {
  const body: EnsureEventFolderBody = await req.json();

  const { eventId, title } = body;
  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const folder = {
    id: `folder_${eventId}`,
    name: title ?? `event_${eventId}`,
    mimeType: "application/vnd.google-apps.folder",
  };

  return NextResponse.json({ folder });
}
