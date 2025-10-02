// @ts-nocheck
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function GET(req: NextRequest, context) {
  const fileId = context.params.id;

  try {
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    const buffer = Buffer.from(response.data as ArrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
