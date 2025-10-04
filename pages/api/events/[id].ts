import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const sheets = await getSheetsClient();
    const range = "Events!A2:G";

    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const found = (rows.data.values || []).find(r => r[0] === id);

    if (!found) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = {
      id: found[0],
      title: found[1],
      date: found[2],
      location: found[3],
      type: found[4],
      description: found[5],
      folderId: found[6],
    };

    res.status(200).json({ event });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
