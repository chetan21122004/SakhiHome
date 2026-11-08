import { NextResponse } from "next/server";
import { loginClient } from "@/lib/client-access";
import {
  CLIENT_COOKIE,
  clientSessionCookieOptions,
  createClientSession,
  encodeClientSession,
} from "@/lib/client-session";
import { checkShareRateLimit } from "@/lib/share-rate-limit";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (!checkShareRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      phone?: string;
      pin?: string;
      portalToken?: string;
    };
    const result = await loginClient(
      String(body.phone ?? ""),
      String(body.pin ?? ""),
      body.portalToken?.trim() || undefined,
    );
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    const token = encodeClientSession(createClientSession(result.clientId));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(CLIENT_COOKIE, token, clientSessionCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 500 },
    );
  }
}
