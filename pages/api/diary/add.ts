import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

type Body = { id: string; title: string; content?: string; date?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, title, content = "", date = "" } = req.body as Body;
    if (!id || !title) return res.status(400).json({ error: "id and title are required" });

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Diaries!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[id, title, content, date]] }, // A:ID B:Title C:Content D:Date
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("Diary add error:", e);
    res.status(500).json({ error: e.message });
  }
}
