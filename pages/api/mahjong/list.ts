import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sheets = await getSheetsClient();

    // 例: シート名が "Mahjong" の A1:E100 を読む
    const range = "Mahjong!A1:E100";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    res.status(200).json({ values: response.data.values ?? [] });
  } catch (e: any) {
    console.error("Sheets API error:", e);
    res.status(500).json({ error: e.message });
  }
}
