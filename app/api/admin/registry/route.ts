import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import {
  loadRegistryForAdmin,
  persistRegistryChanges,
} from "@/lib/admin-registry-server";
import { filterRegistryChangesForRole } from "@/lib/field-maid-policy";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await loadRegistryForAdmin());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Load failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      changes?: { table: string; before: unknown; after: unknown }[];
      messages?: string[];
    };
    const changes = filterRegistryChangesForRole(
      session.role,
      body.changes ?? [],
    );
    await persistRegistryChanges(changes, body.messages ?? []);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 },
    );
  }
}
