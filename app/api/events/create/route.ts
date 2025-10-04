import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, folderId } = await req.json();

    if (!title || !folderId)
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });

    const { data, error } = await supabase
      .from("events")
      .insert([{ title, folder_id: folderId }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, event: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
