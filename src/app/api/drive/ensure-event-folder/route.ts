import { NextRequest, NextResponse } from "next/server";
import { getDrive, ROOT_FOLDER_ID } from "@/lib/googleDrive";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { eventId, title } = await req.json();
    if (!eventId) return NextResponse.json({ error: "eventId is required" }, { status: 400 });

    const drive = getDrive();

    // すでに存在するか検索（appProperties で紐付け）
    const q =
      `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and appProperties has { key='eventId' and value='${eventId}' } and trashed=false`;
    const search = await drive.files.list({
      q,
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    if (search.data.files && search.data.files.length > 0) {
      return NextResponse.json({ folderId: search.data.files[0].id });
    }

    // なければ作成
    const created = await drive.files.create({
      requestBody: {
        name: title ? `event-${eventId}-${title}` : `event-${eventId}`,
        mimeType: "application/vnd.google-apps.folder",
        parents: [ROOT_FOLDER_ID],
        appProperties: { eventId },
      },
      fields: "id",
      supportsAllDrives: true,
    });

    return NextResponse.json({ folderId: created.data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
