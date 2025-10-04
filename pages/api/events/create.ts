import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sheets = await getSheetsClient();

    // 既存のイベント一覧を取得
    const range = "Events!A2:H";
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const existing = rows.data.values || [];
    const nextId = `event${String(existing.length + 1).padStart(3, "0")}`;

    const { title, date, location, type, summary, description } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title と Date は必須です" });
    }

    // 新しい行を追加
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Events!A2:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          nextId,
          title,
          date,
          location || "",
          type || "",
          summary || "",
          description || "",
          "" // folderId 未使用なら空
        ]],
      },
    });

    return res.status(200).json({ id: nextId });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
