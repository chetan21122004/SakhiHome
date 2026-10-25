/**
 * Run SQL via Supabase Management API.
 * Token: SUPABASE_ACCESS_TOKEN env, or .cursor/mcp.json (local dev).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ref = "jesfduyyewrxmtoudkyr";
let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  try {
    const mcp = JSON.parse(readFileSync(".cursor/mcp.json", "utf8"));
    token = mcp.mcpServers?.supabase?.env?.SUPABASE_ACCESS_TOKEN;
  } catch {
    /* ignore */
  }
}
const file = process.argv[2];
if (!token || !file) {
  console.error(
    "Usage: node scripts/run-management-sql.mjs <path.sql>",
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
console.log("OK:", file);
