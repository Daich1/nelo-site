import type { NextApiRequest, NextApiResponse } from "next";
import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Events!A2:D", // A:ID, B:Title, C:Date, D:Description
    });

    const rows = response.data.values || [];
    const event = rows.find((r) => r[0] === id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      id: event[0],
      title: event[1],
      date: event[2],
      description: event[3],
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
