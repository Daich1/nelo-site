import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // まずシートから folderId を取得
    const sheets = await getSheetsClient();
    const range = "Events!A2:G";
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = rows.data.values || [];
    const found = values.find(r => r[0] === id);
    if (!found) return res.status(404).json({ error: "Event not found" });

    const folderId = found[6];
    if (!folderId) return res.status(400).json({ error: "No folderId" });

    // Drive クライアント
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const drive = google.drive({ version: "v3", auth });

    // フォルダ内の画像ファイルを取得
    const files = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id,name,thumbnailLink,webViewLink)",
      pageSize: 20, // 最大20枚まで表示
    });

    res.status(200).json({ photos: files.data.files || [] });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
