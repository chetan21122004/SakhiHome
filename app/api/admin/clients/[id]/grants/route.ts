import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import { grantMaidsToClient, patchGrants } from "@/lib/client-access";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: clientId } = await context.params;
  try {
    const body = (await request.json()) as {
      maidIds?: string[];
      level?: "teaser" | "full";
    };
    const maidIds = body.maidIds ?? [];
    if (!maidIds.length) {
      return NextResponse.json({ error: "maidIds required" }, { status: 400 });
    }
    const level = body.level ?? "teaser";
    if (level === "full" && session.role !== "Admin") {
      return NextResponse.json({ error: "Admin only for full access" }, { status: 403 });
    }
    await grantMaidsToClient(clientId, maidIds, level, session.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: clientId } = await context.params;
  try {
    const body = (await request.json()) as {
      action?: "upgrade" | "revoke";
      grantIds?: string[];
    };
    if (body.action === "upgrade" && session.role !== "Admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    if (!body.action || !body.grantIds?.length) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    await patchGrants(clientId, body.action, body.grantIds);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
