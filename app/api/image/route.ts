import { NextResponse } from "next/server";

/**
 * Google Drive ファイルを中継してCORSを回避するAPI
 * /api/image?id=xxx 形式で呼び出す
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Google Driveの実URL
  const driveUrl = `https://drive.google.com/uc?export=view&id=${id}`;

  try {
    const res = await fetch(driveUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Drive proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
