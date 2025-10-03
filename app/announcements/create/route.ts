import { NextResponse } from "next/server";
import { addAnnouncementRow } from "@/lib/sheets";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, summary, content } = body;
    const id = `${Date.now()}`;
    const date = new Date().toISOString().split("T")[0];

    await addAnnouncementRow({ id, title, date, summary, content, createdBy: user.name ?? "Unknown" });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
