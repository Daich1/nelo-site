import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const sheets = await getSheetsClient();
    const range = "Events!A2:G";

    // 既存行を取得
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = rows.data.values || [];
    const index = values.findIndex(r => r[0] === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    // 実際のシート行番号（ヘッダーがあるので +2）
    const rowNumber = index + 2;

    // 行削除リクエスト
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // ★注意: シートの内部ID（通常は0、違う場合は確認必要）
                dimension: "ROWS",
                startIndex: rowNumber - 1, // 0始まり
                endIndex: rowNumber,       // startIndex+1
              },
            },
          },
        ],
      },
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
