import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import {
  getClientById,
  listGrantsForClientAdmin,
  updateClient,
} from "@/lib/client-access";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const grants = await listGrantsForClientAdmin(id);
    return NextResponse.json({ client, grants });
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
  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.seriousClient === true && session.role !== "Admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    await updateClient(
      id,
      {
        name: body.name as string | undefined,
        phone: body.phone as string | undefined,
        area: body.area as string | undefined,
        service: body.service as string | undefined,
        message: body.message as string | undefined,
        status: body.status as "lead" | "active" | "closed" | undefined,
        portalEnabled: body.portalEnabled as boolean | undefined,
        seriousClient: body.seriousClient as boolean | undefined,
        notes: body.notes as string | undefined,
      },
      session.email,
    );
    const client = await getClientById(id);
    return NextResponse.json({ client });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
