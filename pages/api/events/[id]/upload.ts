import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { folderId } = req.query;
    if (!folderId || typeof folderId !== "string") {
      return res.status(400).json({ error: "Invalid folderId" });
    }

    const form = formidable({ multiples: true });
    const [fields, files] = await form.parse(req);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    const drive = google.drive({ version: "v3", auth });

    const uploaded: any[] = [];
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];

    for (const file of fileArray) {
      if (!file) continue;
      const stream = fs.createReadStream(file.filepath);
      const resp = await drive.files.create({
        requestBody: {
          name: file.originalFilename || "upload",
          parents: [folderId],
        },
        media: { mimeType: file.mimetype || "application/octet-stream", body: stream },
        fields: "id,webViewLink,thumbnailLink",
      });
      uploaded.push(resp.data);
    }

    res.status(200).json({ uploaded });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
