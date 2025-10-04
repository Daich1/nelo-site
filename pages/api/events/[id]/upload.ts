import { getDriveClient, getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const drive = await getDriveClient();
    const sheets = await getSheetsClient();

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Form parse error" });

      const eventId = fields.eventId?.[0] as string;
      const file = files.file?.[0];
      if (!file || !eventId) return res.status(400).json({ error: "Missing file or eventId" });

      const filePath = file.filepath;
      const fileName = file.originalFilename || "upload";
      const mimeType = file.mimetype || "application/octet-stream";

      // Drive にアップロード
      const uploaded = await drive.files.create({
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

      const fileId = uploaded.data.id!;

      // 公開権限を付与
      await drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
        supportsAllDrives: true,
      });

      // Sheets に記録
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Albums!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[eventId, fileId, fileName, mimeType, new Date().toISOString()]],
        },
      });

      res.status(200).json({
        success: true,
        fileId,
        url: `https://drive.google.com/uc?id=${fileId}`,
      });
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}
