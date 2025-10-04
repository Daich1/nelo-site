import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, title, date, location, type, description, folderId } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const sheets = await getSheetsClient();
    const range = "Events!A2:G";

    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = rows.data.values || [];
    const index = values.findIndex(r => r[0] === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    // 行番号（1行目ヘッダーなので +2）
    const rowNumber = index + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Events!A${rowNumber}:G${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          id,
          title,
          date,
          location || "",
          type || "",
          description || "",
          folderId || ""
        ]],
      },
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
