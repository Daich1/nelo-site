// lib/sheets.ts
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function addEventRow(event: {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: string;
  summary: string;
  description: string;
  folderId: string;
}) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        event.slug,
        event.title,
        event.date,
        event.location,
        event.type,
        event.summary,
        event.description,
        event.folderId,
      ]],
    },
  });
}

export async function listEventsFromSheet() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "A2:H",
  });

  const rows = res.data.values || [];
  return rows.map(r => ({
    slug: r[0],
    title: r[1],
    date: r[2],
    location: r[3],
    type: r[4],
    summary: r[5],
    description: r[6],
    folderId: r[7],
  }));
}
