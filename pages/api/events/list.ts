import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sheets = await getSheetsClient();

    // ✅ タブ名を正しく指定
    const range = "Events!A2:G"; 
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const events = (rows.data.values || []).map((r) => ({
      id: r[0] || "",
      title: r[1] || "",
      date: r[2] || "",
      location: r[3] || "",
      type: r[4] || "",
      description: r[5] || "",
      folderId: r[6] || "",
    }));

    res.status(200).json({ events });
  } catch (e: any) {
    console.error("Error in events/list:", e);
    res.status(500).json({ error: e.message });
  }
}
