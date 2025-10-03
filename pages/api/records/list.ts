import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sheets = await getSheetsClient();
    const range = "MatchRecords!A2:Z"; // 必要に応じて列数拡張
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    const records = result.data.values || [];
    res.status(200).json({ records });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
