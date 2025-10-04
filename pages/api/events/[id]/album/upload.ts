import { getDriveClient, getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

function firstString(val: string | string[] | undefined): string {
  if (!val) return "";
  return Array.isArray(val) ? val[0] : val;
}

function toFileArray(val: File | File[] | undefined): File[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const drive = await getDriveClient();
  const sheets = await getSheetsClient();

  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    const eventId = firstString(fields.eventId as string | string[] | undefined);
    if (!eventId) return res.status(400).json({ error: "Missing eventId" });

    const uploadFiles = toFileArray(files.files as File | File[] | undefined);
    if (uploadFiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploaded: any[] = [];

    for (const f of uploadFiles) {
      const filePath = f.filepath;
      const fileName = f.originalFilename || "upload";
      const mimeType = f.mimetype || "application/octet-stream";

      // Drive アップロード
      const resFile = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: ["1gdUJG4IDaf7LB92bvJjMMb1KGHk1aNyk"], // 共有ドライブID
        },
        media: {
          mimeType,
          body: fs.createReadStream(filePath),
        },
        supportsAllDrives: true,
      });

      const fileId = resFile.data.id!;

      // 公開権限付与
      await drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
        supportsAllDrives: true,
      });

      // Sheets に追記
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Albums!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[eventId, fileId, fileName, mimeType, new Date().toISOString()]],
        },
      });

      uploaded.push({
        id: fileId,
        name: fileName,
        mimeType,
        thumbnailLink: `https://drive.google.com/uc?id=${fileId}`,
      });
    }

    res.status(200).json({ uploaded });
  });
}
