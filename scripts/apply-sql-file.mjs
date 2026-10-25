/**
 * Apply a .sql file via Supabase Management API (needs personal access token).
 *
 *   SUPABASE_ACCESS_TOKEN=... node scripts/apply-sql-file.mjs database/staff-registration.sql
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ref = "jesfduyyewrxmtoudkyr";
const token = process.env.SUPABASE_ACCESS_TOKEN;
const file = process.argv[2];

if (!token || !file) {
  console.error(
    "Usage: SUPABASE_ACCESS_TOKEN=... node scripts/apply-sql-file.mjs <path.sql>",
  );
  process.exit(1);
}

const query = readFileSync(resolve(process.cwd(), file), "utf8");
const response = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  },
);

const body = await response.text();
if (!response.ok) {
  console.error(body);
  process.exit(1);
}
console.log("Applied:", file);
