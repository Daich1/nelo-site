import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Drive認証
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    // フォルダ作成
    const folder = await drive.files.create({
      requestBody: { name: `Album_${id}`, mimeType: "application/vnd.google-apps.folder" },
      fields: "id",
    });

    const folderId = folder.data.id;
    if (!folderId) throw new Error("フォルダ作成失敗");

    // Sheets更新
    const sheets = await getSheetsClient();
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Events!A2:G",
    });
    const values = rows.data.values || [];
    const index = values.findIndex(r => r[0] === id);
    if (index === -1) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const rowNumber = index + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Events!G${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[folderId]] },
    });

    return NextResponse.json({ folderId });
  } catch (e: any) {
    console.error("createAlbum error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
