import { NextRequest } from "next/server";
import { getDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const drive = getDrive();
  const fileId = params.id;

  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  const meta = await drive.files.get({
    fileId,
    fields: "name,mimeType",
  });

  return new Response(Buffer.from(res.data as ArrayBuffer), {
    headers: {
      "Content-Type": meta.data.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${meta.data.name}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
