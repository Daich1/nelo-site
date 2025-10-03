import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.DIARY_SHEET_ID!;
  const range = "Diaries!A:E";

  const result = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = result.data.values || [];

  const diary = rows.find((r) => r[0] === id);
  if (!diary) return res.status(404).json({ error: "Not found" });

  res.status(200).json({
    id: diary[0],
    date: diary[1],
    title: diary[2],
    content: diary[3],
    author: diary[4],
  });
}
