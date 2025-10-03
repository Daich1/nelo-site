import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Diaries!A2:D",
    });
    const rows = response.data.values || [];
    const row = rows.find(r => r[0] === id);
    if (!row) return res.status(404).json({ error: "Diary not found" });

    res.status(200).json({ id: row[0], title: row[1], content: row[2], date: row[3] });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
