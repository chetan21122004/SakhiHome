import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ email: session.email, role: session.role });
}
