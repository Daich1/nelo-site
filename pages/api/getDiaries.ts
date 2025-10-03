import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.DIARY_SHEET_ID!;
  const range = "Diaries!A:E";

  const result = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = result.data.values || [];

  const diaries = rows.slice(1).map((r) => ({
    id: r[0],
    date: r[1],
    title: r[2],
    content: r[3],
    author: r[4],
  }));

  diaries.sort((a, b) => (a.date < b.date ? 1 : -1));
  res.status(200).json(diaries);
}
