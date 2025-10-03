import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";
import { ensureEventFolder } from "@/lib/drive";

type Body = { id: string; title: string; date?: string; description?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, title, date = "", description = "" } = req.body as Body;
    if (!id || !title) return res.status(400).json({ error: "id and title are required" });

    const folderId = await ensureEventFolder(id, title);

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Events!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[id, title, date, description, folderId]] }, // A:ID B:Title C:Date D:Desc E:DriveFolderId
    });

    res.status(200).json({ ok: true, folderId });
  } catch (e: any) {
    console.error("Event create error:", e);
    res.status(500).json({ error: e.message });
  }
}
