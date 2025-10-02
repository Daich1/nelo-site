import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function listDriveImages(folderId: string) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    orderBy: "createdTime desc",
    fields: "files(id, name)",
  });

  return (
    res.data.files?.map((f) => ({
      id: f.id!,
      name: f.name!,
      url: `https://drive.google.com/uc?id=${f.id}`,
    })) || []
  );
}
