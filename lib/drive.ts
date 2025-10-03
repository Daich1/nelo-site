import { google } from "googleapis";

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER as string;

export function driveClient(scope: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [scope],
  });
  return google.drive({ version: "v3", auth });
}

/** Neloサイト用の親フォルダ配下にイベントフォルダを確保（存在すれば再利用） */
export async function ensureEventFolder(eventId: string, title?: string): Promise<string> {
  const drive = driveClient("https://www.googleapis.com/auth/drive");

  const res = await drive.files.list({
    q: `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and name='${eventId}' and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: eventId,
      mimeType: "application/vnd.google-apps.folder",
      description: title || "",
      parents: [ROOT_FOLDER_ID],
    },
    fields: "id",
  });

  return folder.data.id!;
}
