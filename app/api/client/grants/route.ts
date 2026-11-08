import { NextResponse } from "next/server";
import { listClientGrants } from "@/lib/client-access";
import { readClientSession } from "@/lib/client-session";

export async function GET() {
  const session = await readClientSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const grants = await listClientGrants(session.clientId);
    return NextResponse.json({ grants });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
