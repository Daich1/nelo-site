import { NextResponse } from "next/server";
import { google } from "googleapis";
import { addEventRow, listEventsFromSheet } from "../lib/sheets";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user.role !== "Admin") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, date, location, description, type, summary } = body;

    const slug = `${date}-${title.replace(/\\s+/g, "-").toLowerCase()}`;

    // Drive フォルダ作成
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    const folder = await drive.files.create({
      requestBody: {
        name: `${date}_${title}`,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    const folderId = folder.data.id!;

    // Sheets に保存
    await addEventRow({
      slug,
      title,
      date,
      location,
      type,
      summary,
      description,
      folderId,
    });

    return NextResponse.json({ success: true, folderId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
