import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { digitsOnlyIndianMobile } from "./india-contact";

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export function normalizePhone(phone: string): string {
  return digitsOnlyIndianMobile(phone);
}

export function hashClientPin(pin: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(pin, salt, 32, SCRYPT_PARAMS);
  return `scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export function verifyClientPin(pin: string, stored: string): boolean {
  if (!stored || !pin) return false;
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[1], "base64url");
    const expected = Buffer.from(parts[2], "base64url");
    const actual = scryptSync(pin, salt, 32, SCRYPT_PARAMS);
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function generateClientPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
