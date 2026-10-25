import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyStaffTableLogin } from "@/lib/admin-login-server";
import {
  ADMIN_COOKIE,
  createAdminSession,
  encodeAdminSession,
  sessionCookieOptions,
} from "@/lib/admin-session";
import { normalizeStaffEmail } from "@/lib/staff-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = normalizeStaffEmail(body.email ?? "");
    const password = body.password ?? "";
    const staff = await verifyStaffTableLogin(email, password);
    if (!staff) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const token = encodeAdminSession(
      createAdminSession(staff.email, staff.role),
    );
    const jar = await cookies();
    jar.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return NextResponse.json({ email: staff.email, role: staff.role });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Login failed. Is SUPABASE_SERVICE_ROLE_KEY set?",
      },
      { status: 500 },
    );
  }
}
