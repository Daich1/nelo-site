import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      date, map, startTeam, allyScore, enemyScore, result,
      members, agents, memo,
    } = req.body;

    const sheets = await getSheetsClient();
    const values = [
      [
        date, map, startTeam, allyScore, enemyScore, result,
        members[0], agents[0],
        members[1], agents[1],
        members[2], agents[2],
        members[3], agents[3],
        members[4], agents[4],
        memo,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "MatchRecords!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.status(200).json({ message: "戦績を追加しました" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
