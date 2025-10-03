import { google } from "googleapis";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// --- イベント ---
export async function addEventRow(data: {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: string;
  summary: string;
  description: string;
  folderId: string;
}) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Events!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[
      data.slug, data.title, data.date, data.location,
      data.type, data.summary, data.description, data.folderId,
    ]] },
  });
}

export async function listEventsFromSheet() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Events!A:H",
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  return rows.slice(1).map((row) => ({
    slug: row[0],
    title: row[1],
    date: row[2],
    location: row[3],
    type: row[4],
    summary: row[5],
    description: row[6],
    folderId: row[7],
  }));
}

export async function getEventBySlug(slug: string) {
  const events = await listEventsFromSheet();
  return events.find((e) => e.slug === slug) || null;
}

// --- お知らせ ---
export async function addAnnouncementRow(data: {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  createdBy: string;
}) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Announcements!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[
      data.id, data.title, data.date,
      data.summary, data.content, data.createdBy,
    ]] },
  });
}

export async function listAnnouncementsFromSheet() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Announcements!A:F",
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  return rows.slice(1).map((row) => ({
    id: row[0],
    title: row[1],
    date: row[2],
    summary: row[3],
    content: row[4],
    createdBy: row[5],
  }));
}
