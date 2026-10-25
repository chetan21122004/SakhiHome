import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { loadWorkersForAdmin } from "@/lib/admin-registry-server";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const workers = await loadWorkersForAdmin();
    return NextResponse.json({ workers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Load failed" },
      { status: 500 },
    );
  }
}
