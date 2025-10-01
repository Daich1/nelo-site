import { NextRequest, NextResponse } from "next/server";
import { DriveFile, ListFilesQuery } from "@/types/drive";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const pageSizeRaw = searchParams.get("pageSize");

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const query: ListFilesQuery = {
    eventId,
    pageSize: pageSizeRaw ? Number(pageSizeRaw) : undefined,
  };

  // 実装に合わせて Drive から取得
  const files: DriveFile[] = [
    { id: "1", name: "sample1.jpg", mimeType: "image/jpeg" },
    { id: "2", name: "sample2.jpg", mimeType: "image/jpeg" },
    { id: "3", name: "sample3.jpg", mimeType: "image/jpeg" },
  ];

  const limit = query.pageSize ?? files.length;
  return NextResponse.json({ files: files.slice(0, limit) });
}
