import { google } from "googleapis";

export async function listFolderImages(folderId: string, maxResults = 3) {
  if (!folderId) return [];

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    orderBy: "createdTime desc",
    pageSize: maxResults,
    fields: "files(id, name, thumbnailLink, webViewLink)",
  });

  return (
    res.data.files?.map((file) => ({
      id: file.id!,
      name: file.name!,
      thumbnail: file.thumbnailLink!,
      link: file.webViewLink!,
    })) || []
  );
}
