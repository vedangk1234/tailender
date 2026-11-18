// Seed the cricket content (entities, questions, answers) into Supabase.
// Usage: SB_TOKEN=... node scripts/seed.mjs
//
// Content lives in scripts/content.mjs (shared with validateContent.mjs).
// It is hand-authored from well-known cricket records — still spot-check before
// a public launch, and keep growing the bank toward the ~500 spec target.
import { ENTITIES, QUESTIONS } from "./content.mjs";

const REF = "zomlnwhcfjhrvvczqcuv";
const token = process.env.SB_TOKEN;

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a) => "array[" + a.map(q).join(",") + "]::text[]";

const lines = [];
for (const [id, canon, aliases] of ENTITIES) {
  lines.push(`insert into public.entities(id,canonical,aliases) values(${q(id)},${q(canon)},${arr(aliases)}) on conflict(id) do update set canonical=excluded.canonical, aliases=excluded.aliases;`);
}
for (const qu of QUESTIONS) {
  lines.push(`insert into public.questions(id,prompt,category) values(${q(qu.id)},${q(qu.prompt)},${q(qu.category)}) on conflict(id) do update set prompt=excluded.prompt, category=excluded.category;`);
  for (const [eid, tier] of qu.answers) {
    lines.push(`insert into public.question_answers(question_id,entity_id,tier) values(${q(qu.id)},${q(eid)},${q(tier)}) on conflict(question_id,entity_id) do update set tier=excluded.tier;`);
  }
}

const sql = lines.join("\n");

if (!token) {
  console.error("Set SB_TOKEN (Supabase access token) to run the seed.");
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: sql }),
});
console.log("HTTP", res.status, (await res.text()).slice(0, 300));
console.log(`Seeded ${ENTITIES.length} entities, ${QUESTIONS.length} questions.`);
process.exit(res.ok ? 0 : 1);
