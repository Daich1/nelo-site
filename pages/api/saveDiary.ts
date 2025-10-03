import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, content } = req.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.DIARY_SHEET_ID!;
  const date = new Date().toISOString().split("T")[0];
  const id = `${date.replace(/-/g, "")}_${Date.now()}`;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Diaries!A:E", // ← 固定でDiariesシート
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, date, title, content, "Admin"]],
    },
  });

  res.status(200).json({ message: "saved" });
}
