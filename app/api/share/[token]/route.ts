import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { resolveShareByToken } from "@/lib/maid-share";

/** Legacy maid share tokens — staff only. Clients use /api/client/grants. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  if (!(await readAdminSession())) {
    return NextResponse.json(
      { error: "Profiles require login. Use your client portal link." },
      { status: 401 },
    );
  }
  const { token } = await context.params;
  const result = await resolveShareByToken(token);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }
  return NextResponse.json(result);
}
