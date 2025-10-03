import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sheets = await getSheetsClient();
    const range = "Players!A2:A"; // 1行目はヘッダー
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    const players = result.data.values?.flat() || [];
    res.status(200).json({ players });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
