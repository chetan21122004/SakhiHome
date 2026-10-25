/**
 * One-time: create / update the bootstrap admin auth user (no email confirmation).
 *
 * Requires in .env.local (never commit):
 *   SUPABASE_SERVICE_ROLE_KEY=<service role secret from Supabase Dashboard → API>
 *
 * Usage: node scripts/bootstrap-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PRIMARY_ADMIN_EMAIL = "chetan44rt@gmail.com";
const INITIAL_PASSWORD = "123456";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      const value = t.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (in .env.local).",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: list, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) {
  console.error(listError.message);
  process.exit(1);
}

const existing = list.users.find(
  (u) => u.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL,
);

if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password: INITIAL_PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log(`Updated password for ${PRIMARY_ADMIN_EMAIL} (email confirmed).`);
} else {
  const { error } = await admin.auth.admin.createUser({
    email: PRIMARY_ADMIN_EMAIL,
    password: INITIAL_PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log(`Created ${PRIMARY_ADMIN_EMAIL} with initial password (change after login).`);
}

console.log(
  "In Supabase Dashboard → Authentication → Providers → Email: turn OFF “Confirm email” so sign-in works without verification.",
);
