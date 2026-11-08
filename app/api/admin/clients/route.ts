import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import {
  createManualClient,
  listClients,
} from "@/lib/client-access";

export async function GET() {
  if (!(await readAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clients = await listClients();
    return NextResponse.json({ clients });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
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
      name?: string;
      phone?: string;
      area?: string;
      service?: string;
      message?: string;
      notes?: string;
    };
    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    }
    const { client, pin } = await createManualClient({
      name: body.name,
      phone: body.phone,
      area: body.area,
      service: body.service,
      message: body.message,
      notes: body.notes,
    });
    return NextResponse.json({ client, pin });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
