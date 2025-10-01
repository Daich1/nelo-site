import { NextRequest, NextResponse } from "next/server";
import { getDrive, ROOT_FOLDER_ID } from "@/lib/googleDrive";

export const runtime = "nodejs";

async function findFolderIdByEventId(drive: ReturnType<typeof getDrive>, eventId: string) {
  const q =
    `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and appProperties has { key='eventId' and value='${eventId}' } and trashed=false`;
  const search = await drive.files.list({
    q,
    fields: "files(id,name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return search.data.files?.[0]?.id;
}

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get("eventId");
    if (!eventId) return NextResponse.json({ error: "eventId is required" }, { status: 400 });

    const drive = getDrive();
    const folderId = await findFolderIdByEventId(drive, eventId);
    if (!folderId) return NextResponse.json({ files: [] });

    const list = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      orderBy: "createdTime desc",
      fields:
        "files(id,name,createdTime,mimeType,thumbnailLink,webViewLink,webContentLink)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      pageSize: 200,
    });

    return NextResponse.json({ files: list.data.files || [] });
} catch (e: unknown) {
  const message =
    e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
  return NextResponse.json({ error: message }, { status: 500 });
}

}
