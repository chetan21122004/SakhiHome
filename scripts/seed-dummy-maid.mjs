/**
 * Insert/update DEMO-TEST-MAID with full fields, placeholder storage files, and share links.
 *
 *   node scripts/seed-dummy-maid.mjs
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: run database/maid_share_links.sql first if share insert fails.
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MAID_ID = "DEMO-TEST-MAID";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",
  "base64",
);

const payload = {
  id: MAID_ID,
  name: "Priya Sharma (Demo)",
  phone: "9876543210",
  area: "Hinjewadi Phase 3",
  services: ["Cleaning", "Cooking", "Childcare"],
  experience: 8,
  salary: "14000",
  languages: "Marathi, Hindi, basic English",
  schedule: "7:00 AM – 4:00 PM, Mon–Sat",
  status: "Available",
  verification: "Verified",
  address: "Flat 204, Wing B, Sample Society, Wakad, Pune 411057",
  maritalStatus: "Married",
  guardian: "Raj Sharma (husband) · 9876543211",
  dependants: "2",
  emergency: "Raj Sharma · 9876543211",
  notes:
    "INTERNAL: Demo profile for testing share links and field UI. Not a real person.",
  photoPath: `${MAID_ID}/photo.png`,
  documents: [
    {
      id: "demo-doc-identity",
      name: "Identity proof",
      file: "aadhaar-demo.png",
      path: `${MAID_ID}/aadhaar-demo.png`,
      reviewed: true,
    },
    {
      id: "demo-doc-address",
      name: "Address proof",
      file: "address-demo.png",
      path: `${MAID_ID}/address-demo.png`,
      reviewed: true,
    },
    {
      id: "demo-doc-police",
      name: "Police verification",
      file: "police-demo.png",
      path: `${MAID_ID}/police-demo.png`,
      reviewed: true,
    },
    {
      id: "demo-doc-ref",
      name: "Reference letter",
      note: "Previous employer in Blue Ridge",
      file: "reference-demo.png",
      path: `${MAID_ID}/reference-demo.png`,
      reviewed: false,
    },
    {
      id: "demo-doc-exp",
      name: "Experience certificate",
      note: "5 years cooking",
      file: "experience-demo.png",
      path: `${MAID_ID}/experience-demo.png`,
      reviewed: false,
    },
  ],
};

async function uploadPlaceholder(path, bucket) {
  const { error } = await sb.storage.from(bucket).upload(path, PNG, {
    contentType: "image/png",
    upsert: true,
  });
  if (error && !error.message?.includes("already exists")) {
    throw new Error(`${bucket}/${path}: ${error.message}`);
  }
}

const photoPath = payload.photoPath;
await uploadPlaceholder(photoPath, "maid-photos");
for (const doc of payload.documents) {
  if (doc.path) await uploadPlaceholder(doc.path, "maid-documents");
}

const { error: maidError } = await sb.from("maids").upsert({
  id: MAID_ID,
  payload,
});
if (maidError) {
  console.error("Maid upsert failed:", maidError.message);
  process.exit(1);
}

const teaser = randomBytes(32).toString("base64url");
const full = randomBytes(32).toString("base64url");
const expires = new Date();
expires.setDate(expires.getDate() + 90);

const { error: linkError } = await sb.from("maid_share_links").upsert({
  maid_id: MAID_ID,
  teaser_token: teaser,
  full_token: full,
  created_by: "seed-dummy-maid.mjs",
  expires_at: expires.toISOString(),
  revoked_at: null,
});

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

console.log("Demo maid ready:", MAID_ID);
console.log("  Name:", payload.name);
console.log("  Open in /field or /admin and search Priya or DEMO-TEST-MAID");

if (linkError) {
  console.warn(
    "Share links not created (run database/maid_share_links.sql):",
    linkError.message,
  );
  console.log(
    "Or apply SQL only:",
    "node scripts/apply-sql-file.mjs database/seed-dummy-maid.sql",
  );
} else {
  console.log("  Basic share:", `${site}/s/${teaser}`);
  console.log("  Full share: ", `${site}/s/${full}`);
}
