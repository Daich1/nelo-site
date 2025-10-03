import type { NextApiRequest, NextApiResponse } from "next";
import { driveClient, ensureEventFolder } from "@/lib/drive";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: eventId } = req.query;
  if (!eventId || Array.isArray(eventId)) return res.status(400).json({ error: "Invalid eventId" });

  try {
    const folderId = await ensureEventFolder(eventId as string);
    const drive = driveClient("https://www.googleapis.com/auth/drive");

    const list = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, thumbnailLink)",
    });

    res.status(200).json({ files: list.data.files || [] });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
