import { NextResponse } from "next/server";
import { resolveShareByToken } from "@/lib/maid-share";
import { checkShareRateLimit } from "@/lib/share-rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  if (!checkShareRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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
