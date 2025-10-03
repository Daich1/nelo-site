import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

type Body = { id: string; title: string; body?: string; date?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, title, body = "", date = "" } = req.body as Body;
    if (!id || !title) return res.status(400).json({ error: "id and title are required" });

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Announcements!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[id, title, body, date]] }, // A:ID B:Title C:Body D:Date
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("Announcement create error:", e);
    res.status(500).json({ error: e.message });
  }
}
