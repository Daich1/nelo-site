import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query; // eventId
    const sheets = await getSheetsClient();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Albums!A:E",
    });

    const rows = result.data.values || [];
    const files = rows
      .filter((r) => r[0] === id) // eventId 一致
      .map((r) => ({
        id: r[1],
        name: r[2],
        mimeType: r[3],
        thumbnailLink: `https://drive.google.com/uc?id=${r[1]}`,
        uploadedAt: r[4],
      }));

    res.status(200).json({ files });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch files" });
  }
}
