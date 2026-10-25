import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { getServiceSupabase } from "@/lib/supabase-service";
import { enquiryFromRow } from "@/lib/enquiries";
import type { Json } from "@/lib/database.types";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("enquiries")
    .select("id,payload,created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json((data ?? []).map(enquiryFromRow));
}

export async function PATCH(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string; payload?: Record<string, unknown> };
  if (!body.id || !body.payload) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const sb = getServiceSupabase();
  const { error } = await sb
    .from("enquiries")
    .update({ payload: body.payload as Json })
    .eq("id", body.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
