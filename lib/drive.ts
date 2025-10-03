import { google } from "googleapis";

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

/**
 * イベントごとのフォルダを Drive 上に用意する（存在しなければ作成）
 * @param eventId イベントID（フォルダ名に利用）
 * @param title   イベントのタイトル（説明用に任意）
 * @returns フォルダID
 */
export async function ensureEventFolder(eventId: string, title?: string): Promise<string> {
  const drive = driveClient("https://www.googleapis.com/auth/drive");

  // 既存フォルダを検索
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${eventId}' and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  // 無ければ新規作成
  const folder = await drive.files.create({
    requestBody: {
      name: eventId,
      mimeType: "application/vnd.google-apps.folder",
      description: title || "",
    },
    fields: "id",
  });

  return folder.data.id!;
}
