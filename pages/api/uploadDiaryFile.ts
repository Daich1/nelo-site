import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import formidable, { Fields, Files, File } from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const f = files.file;
    let fileList: File[] = [];

    if (Array.isArray(f)) {
      fileList = f;
    } else if (f) {
      fileList = [f];
    }

    if (fileList.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Google Drive 認証
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    const diaryRootId = process.env.DIARY_FOLDER_ID!;
    const month = new Date().toISOString().slice(0, 7).replace("-", "");

    // 今月フォルダを検索 or 作成
    const list = await drive.files.list({
      q: `'${diaryRootId}' in parents and name='${month}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    let monthFolderId: string;
    if (list.data.files && list.data.files.length > 0) {
      monthFolderId = list.data.files[0].id!;
    } else {
      const f = await drive.files.create({
        requestBody: {
          name: month,
          mimeType: "application/vnd.google-apps.folder",
          parents: [diaryRootId],
        },
        fields: "id",
      });
      monthFolderId = f.data.id!;
    }

    // 複数ファイルをアップロード
    const urls: string[] = [];
    for (const file of fileList) {
      const filePath = file.filepath;
      const mimeType = file.mimetype || "application/octet-stream";
      const fileName = file.originalFilename || "upload";

      const upload = await drive.files.create({
        requestBody: { name: fileName, parents: [monthFolderId] },
        media: { mimeType, body: fs.createReadStream(filePath) },
        fields: "id",
      });

      urls.push(`https://drive.google.com/uc?id=${upload.data.id}`);
    }

    return res.status(200).json({ urls });
  });
}
