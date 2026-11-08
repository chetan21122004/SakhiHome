import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { regenerateClientPin } from "@/lib/client-access";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const pin = await regenerateClientPin(id);
    return NextResponse.json({ pin });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
