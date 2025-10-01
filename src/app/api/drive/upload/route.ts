import { NextRequest, NextResponse } from "next/server";
import { DriveFile, UploadResult } from "@/types/drive";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "multipart/form-data required" }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const eventId = form.get("eventId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (typeof eventId !== "string" || !eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const uploaded: DriveFile = {
    id: `file_${Date.now()}`,
    name: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };

  const result: UploadResult = { file: uploaded };
  return NextResponse.json(result, { status: 201 });
}
