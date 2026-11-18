// Offline sanity-check for the question bank + a simulation of the daily
// rotation (mirrors build_daily_set in 0003_daily_rollover.sql).
// Run: node scripts/validateContent.mjs   (no network needed)
import { ENTITIES, QUESTIONS, TIERS } from "./content.mjs";

let failures = 0;
const fail = (msg) => { console.error("  ✗ " + msg); failures++; };
const ok = (msg) => console.log("  ✓ " + msg);

// ---- Entities ----
const ids = ENTITIES.map((e) => e[0]);
const idSet = new Set(ids);
if (idSet.size !== ids.length) fail("duplicate entity ids"); else ok(`${ids.length} entities, ids unique`);

const aliasSeen = new Map();
for (const [id, canon, aliases] of ENTITIES) {
  if (!canon) fail(`${id}: missing canonical name`);
  if (!Array.isArray(aliases) || aliases.length === 0) fail(`${id}: no aliases`);
  for (const a of aliases) {
    const key = a.toLowerCase().trim();
    if (aliasSeen.has(key) && aliasSeen.get(key) !== id)
      fail(`alias "${a}" shared by ${aliasSeen.get(key)} and ${id}`);
    aliasSeen.set(key, id);
  }
}
ok("aliases present and unambiguous");

// ---- Questions ----
const qids = QUESTIONS.map((q) => q.id);
if (new Set(qids).size !== qids.length) fail("duplicate question ids"); else ok(`${qids.length} questions, ids unique`);

for (const q of QUESTIONS) {
  if (!q.prompt) fail(`${q.id}: empty prompt`);
  if (!q.answers?.length) fail(`${q.id}: no answers`);
  const seen = new Set();
  let hasCommon = false;
  for (const [eid, tier] of q.answers) {
    if (!idSet.has(eid)) fail(`${q.id}: answer "${eid}" is not a known entity`);
    if (!TIERS.includes(tier)) fail(`${q.id}: "${eid}" has invalid tier "${tier}"`);
    if (seen.has(eid)) fail(`${q.id}: duplicate answer "${eid}"`);
    seen.add(eid);
    if (tier === "single" || tier === "double") hasCommon = true;
  }
  if (!hasCommon) fail(`${q.id}: no low-tier "obvious" answer — the trap won't work`);
}
ok("every answer maps to a real entity with a valid tier");
ok("every question has at least one obvious (low-tier) answer");

// ---- Rotation simulation (same math as build_daily_set) ----
const ordered = [...QUESTIONS].map((q) => q.id).sort();
const n = ordered.length;
function setFor(puzzle) {
  const off = ((puzzle - 1) * 5) % n;
  return ordered
    .map((id, rn) => ({ id, pos: ((rn - off + n) % n) }))
    .filter((x) => x.pos < 5)
    .sort((a, b) => a.pos - b.pos)
    .map((x) => x.id);
}
let rotationOk = true;
const coverage = new Set();
for (let p = 1; p <= 40; p++) {
  const s = setFor(p);
  const want = Math.min(5, n);
  if (s.length !== want) { fail(`puzzle #${p}: expected ${want} questions, got ${s.length}`); rotationOk = false; }
  if (new Set(s).size !== s.length) { fail(`puzzle #${p}: repeats a question within the day`); rotationOk = false; }
  s.forEach((id) => coverage.add(id));
}
if (rotationOk) ok(`rotation yields ${Math.min(5, n)} distinct questions/day across 40 days`);
if (coverage.size === n) ok(`all ${n} questions appear within the cycle`);
else fail(`only ${coverage.size}/${n} questions ever appear`);

console.log(
  failures === 0
    ? `\nAll content checks passed. (${ids.length} entities, ${qids.length} questions)`
    : `\n${failures} check(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);
