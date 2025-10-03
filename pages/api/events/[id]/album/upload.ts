import type { NextApiRequest, NextApiResponse } from "next";
import { driveClient, ensureEventFolder } from "@/lib/drive";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }, // formidable を使うためオフ
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id: eventId } = req.query;
  if (!eventId || Array.isArray(eventId)) return res.status(400).json({ error: "Invalid eventId" });

  try {
    const folderId = await ensureEventFolder(eventId as string);
    const drive = driveClient("https://www.googleapis.com/auth/drive.file");

    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload parse error" });

      const uploaded: { id: string; name: string }[] = [];

      const fileArray = Array.isArray(files.files) ? files.files : [files.files];
      for (const f of fileArray) {
        if (!f) continue;
        const stream = fs.createReadStream(f.filepath);
        const result = await drive.files.create({
          requestBody: { name: f.originalFilename || "file", parents: [folderId] },
          media: { mimeType: f.mimetype || "application/octet-stream", body: stream },
          fields: "id, name",
        });
        uploaded.push({ id: result.data.id!, name: result.data.name! });
      }

      res.status(200).json({ uploaded });
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
