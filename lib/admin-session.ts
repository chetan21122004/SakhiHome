import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sakhihome_admin";

export type AdminSession = {
  email: string;
  role: "Admin" | "Coordinator";
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
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export function encodeAdminSession(session: AdminSession) {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeAdminSession(token: string): AdminSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as AdminSession;
    if (session.exp < Date.now()) return null;
    if (!session.email) return null;
    return session;
  } catch {
    return null;
  }
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return decodeAdminSession(token);
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function createAdminSession(
  email: string,
  role: "Admin" | "Coordinator",
): AdminSession {
  return {
    email,
    role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
  };
}
