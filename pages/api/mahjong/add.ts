import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { row } = await req.body; // 例: ["2025-10-03", "東風戦", "25000", "30000", "20000", "25000"]

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Mahjong!A1", // シート名＋開始セル
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
