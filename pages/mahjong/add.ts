import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { date, gameType, scores, ranks, comment } = req.body;

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "MAHJONG!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          date,
          gameType,
          scores[0], ranks[0],
          scores[1], ranks[1],
          scores[2], ranks[2],
          scores[3], ranks[3],
          comment
        ]],
      },
    });

    res.status(200).json({ message: "戦績を追加しました" });
  } catch (error) {
    console.error("Error adding mahjong result:", error);
    res.status(500).json({ error: "戦績の追加に失敗しました" });
  }
}
