import { NextRequest, NextResponse } from "next/server";
import { getDrive } from "@/lib/googleDrive";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const drive = getDrive();

    // Google Drive から画像データを取得
    const res = await drive.files.get(
      { fileId: id, alt: "media" }, // alt=media → ファイル本体
      { responseType: "stream" }
    );

    // ストリームをそのまま返す
    return new Response(res.data as any, {
      headers: {
        "Content-Type":
          (res.headers["content-type"] as string) || "application/octet-stream",
        "Cache-Control": "public, max-age=3600", // キャッシュ1時間
      },
    });
  } catch (err: any) {
    console.error("Drive fetch error", err.message);
    return NextResponse.json(
      { error: "Failed to fetch image from Drive", details: err.message },
      { status: 500 }
    );
  }
}
