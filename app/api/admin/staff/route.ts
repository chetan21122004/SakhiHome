import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { getServiceSupabase } from "@/lib/supabase-service";
import { PRIMARY_ADMIN_EMAIL } from "@/lib/staff-auth";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = getServiceSupabase();
  const { data, error } = await sb
    .from("staff_access")
    .select("email,role,enabled")
    .order("created_at");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    email?: string;
    role?: string;
    password?: string;
  };
  const email = body.email?.trim().toLowerCase();
  const role = body.role ?? "Coordinator";
  const password = body.password ?? "";
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  if (role === "Admin" && email !== PRIMARY_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Only the bootstrap admin email may be Admin." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Set a password (6+ characters) for field login." },
      { status: 400 },
    );
  }
  const sb = getServiceSupabase();
  const { error } = await sb
    .from("staff_access")
    .insert({ email, role, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { email?: string; enabled?: boolean };
  if (!body.email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  const sb = getServiceSupabase();
  const { error } = await sb
    .from("staff_access")
    .update({ enabled: body.enabled })
    .eq("email", body.email);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
