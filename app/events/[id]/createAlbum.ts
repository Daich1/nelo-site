import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Drive 認証
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    // 新しいフォルダを作成
    const folder = await drive.files.create({
      requestBody: {
        name: `Album_${id}`,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    const folderId = folder.data.id;
    if (!folderId) throw new Error("Failed to create folder");

    // シートに保存
    const sheets = await getSheetsClient();
    const range = "Events!A2:G";
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = rows.data.values || [];
    const index = values.findIndex(r => r[0] === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    const rowNumber = index + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Events!G${rowNumber}`, // G列=folderId
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[folderId]] },
    });

    res.status(200).json({ folderId });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
