import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query; // eventId
    const sheets = await getSheetsClient();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Albums!A:E", // eventId, fileId, fileName, mimeType, uploadedAt
    });

    const rows = result.data.values || [];
    const files = rows
      .filter((r) => r[0] === id) // eventId 一致
      .map((r) => ({
        eventId: r[0],
        fileId: r[1],
        fileName: r[2],
        mimeType: r[3],
        url: `https://drive.google.com/uc?id=${r[1]}`,
        uploadedAt: r[4],
      }));

    res.status(200).json(files);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch album" });
  }
}
