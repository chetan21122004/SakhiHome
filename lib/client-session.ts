import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CLIENT_COOKIE = "sakhihome_client";

export type ClientSession = {
  clientId: string;
  exp: number;
};

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "development") {
    return "sakhihome-local-dev-session-secret";
  }
  throw new Error(
    "ADMIN_SESSION_SECRET must be set (at least 16 characters) in production.",
  );
}

function sign(body: string) {
  return createHmac("sha256", secret()).update(`client:${body}`).digest("base64url");
}

export function encodeClientSession(session: ClientSession) {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeClientSession(token: string): ClientSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as ClientSession;
    if (session.exp < Date.now()) return null;
    if (!session.clientId) return null;
    return session;
  } catch {
    return null;
  }
}

export async function readClientSession(): Promise<ClientSession | null> {
  const jar = await cookies();
  const token = jar.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  return decodeClientSession(token);
}

export function clientSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function createClientSession(clientId: string): ClientSession {
  return {
    clientId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}
