import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
for (const table of ["maids", "households", "placements", "applications", "registry_activity", "staff_access"]) {
  const result = await client.from(table).select("*").limit(1);
  assert(result.error || result.data.length === 0, `Anonymous access leaked ${table}`);
}
const invalid = await client.from("applications").insert({ id: `CHECK-${crypto.randomUUID()}`, payload: { id: "invalid", status: "New", consent: true } });
assert(invalid.error, "Malformed application was accepted");
const mutation = await client.rpc("save_registry_changes", { changes: [], messages: [] });
assert(mutation.error, "Anonymous registry mutation was accepted");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1sAAAAASUVORK5CYII=", "base64");
const path = `CHECK-${crypto.randomUUID()}/photo.png`;
const upload = await client.storage.from("maid-photos").upload(path, png, { contentType: "image/png" });
assert(upload.error, "Anonymous photo upload was accepted");
const signed = await client.storage.from("maid-photos").createSignedUrl(path, 60);
assert(signed.error, "Anonymous private photo signing was accepted");
console.log("PASS: anonymous access, malformed applications, registry mutations, photo uploads and private URLs are restricted.");
