// Apply a .sql file to the Supabase project via the Management API.
// Usage: SB_TOKEN=... node scripts/applySql.mjs <file.sql>
import fs from "node:fs";

const REF = "zomlnwhcfjhrvvczqcuv";
const token = process.env.SB_TOKEN;
const file = process.argv[2];
if (!token) { console.error("Missing SB_TOKEN"); process.exit(1); }
if (!file) { console.error("Usage: node scripts/applySql.mjs <file.sql>"); process.exit(1); }

const sql = fs.readFileSync(file, "utf8");
const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/database/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  }
);
const text = await res.text();
console.log("HTTP", res.status);
console.log(text.slice(0, 1200));
process.exit(res.ok ? 0 : 1);
