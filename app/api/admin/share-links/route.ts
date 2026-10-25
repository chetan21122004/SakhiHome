import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-session";
import {
  ensureShareLinks,
  getShareLinksForMaid,
} from "@/lib/maid-share";

export async function GET(request: Request) {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const maidId = new URL(request.url).searchParams.get("maidId");
  if (!maidId) {
    return NextResponse.json({ error: "maidId required" }, { status: 400 });
  }
  try {
    const links = await getShareLinksForMaid(maidId);
    return NextResponse.json({ links });
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
      maidId?: string;
      rotate?: boolean;
      expiresInDays?: number;
    };
    const maidId = body.maidId?.trim();
    if (!maidId) {
      return NextResponse.json({ error: "maidId required" }, { status: 400 });
    }
    const links = await ensureShareLinks(maidId, session.email, {
      rotate: Boolean(body.rotate),
      expiresInDays: body.expiresInDays,
    });
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
