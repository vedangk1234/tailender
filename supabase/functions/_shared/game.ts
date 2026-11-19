import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

// ---- Time (midnight IST) ----
const IST = 5.5 * 60 * 60 * 1000;
const EPOCH = Date.UTC(2026, 10, 1); // launch day → puzzle #1

export function istDate(d = new Date()): string {
  return new Date(d.getTime() + IST).toISOString().slice(0, 10);
}
export function puzzleNumber(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z").getTime();
  return Math.floor((d - EPOCH) / 86400000) + 1;
}

// ---- Scoring tiers ----
export const TIER_POINTS: Record<string, number> = {
  duck: 0, single: 10, double: 20, boundary: 40,
  half_century: 50, six: 60, century: 100,
};
export const QUESTIONS_PER_DAY = 5;
export const MAX_DAILY = 500;

// ---- Leagues ----
export const LEAGUES = [
  { id: "gully", name: "Gully cricket", min: 0 },
  { id: "club", name: "Club cricket", min: 40 },
  { id: "county", name: "County cricket", min: 100 },
  { id: "ranji", name: "Ranji Trophy", min: 200 },
  { id: "ipl", name: "Indian Premier League", min: 320 },
  { id: "intl", name: "International cricket", min: 450 },
];
export function leagueFor(total: number) {
  let l = LEAGUES[0];
  for (const x of LEAGUES) if (total >= x.min) l = x;
  return l;
}

// ---- Recognition (normalize + Damerau-Levenshtein) ----
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.'`’_-]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function editDistance(a: string, b: string): number {
  const al = a.length, bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  const d = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) d[i][0] = i;
  for (let j = 0; j <= bl; j++) d[0][j] = j;
  for (let i = 1; i <= al; i++)
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[al][bl];
}
// Strict fuzzy allowance — stops "fishing" (spamming short/near-miss strings to
// let the matcher snap onto rare answers). Uses the shorter of input/alias
// length; no fuzzy under 5 chars; 1 typo for 5-9, 2 for 10+ (was 1/2/3).
function fuzzyAllowed(qLen: number, fLen: number): number {
  const L = Math.min(qLen, fLen);
  if (L < 5) return 0;
  return L >= 10 ? 2 : 1;
}

export interface Entity { id: string; canonical: string; aliases: string[] }

export function resolveEntity(input: string, roster: Entity[]): Entity | null {
  const qn = normalize(input);
  if (!qn) return null;
  for (const e of roster) {
    const forms = [e.canonical, ...e.aliases].map(normalize);
    if (forms.includes(qn)) return e;
  }
  let best: { e: Entity; dist: number } | null = null;
  for (const e of roster) {
    for (const f of [e.canonical, ...e.aliases].map(normalize)) {
      const allowed = fuzzyAllowed(qn.length, f.length);
      if (allowed === 0) continue;
      if (Math.abs(qn.length - f.length) > allowed) continue;
      const dist = editDistance(qn, f);
      if (dist <= allowed && (!best || dist < best.dist)) best = { e, dist };
    }
  }
  return best?.e ?? null;
}

// ---- Daily set resolution (same for `daily` and `guess`) ----
export async function getDailySet(c: SupabaseClient, date: string) {
  let { data: row } = await c.from("daily_sets").select("*").eq("date", date).maybeSingle();

  // Not built yet (cron hasn't run / isn't enabled) → build it now, then re-read.
  if (!row) {
    await c.rpc("build_daily_set", { d: date });
    ({ data: row } = await c.from("daily_sets").select("*").eq("date", date).maybeSingle());
  }
  if (row) return { puzzle: row.puzzle_number as number, ids: row.question_ids as string[] };

  // Final fallback: first 5 questions by id (e.g. RPC missing on an old DB).
  const { data: qs } = await c.from("questions").select("id").order("id").limit(QUESTIONS_PER_DAY);
  return { puzzle: puzzleNumber(date), ids: (qs ?? []).map((q: { id: string }) => q.id) };
}

// ---- Mascot unlock detection ----
// tiers: array of tier strings per question (duck included); total; streak.
export function computeUnlocks(tiers: string[], total: number, streak: number): string[] {
  const has = (t: string) => tiers.includes(t);
  const out = new Set<string>(["default"]);
  if (has("duck")) out.add("flops");
  if (has("single")) out.add("pathetic");
  if (has("boundary")) out.add("gujratty");
  if (has("six")) out.add("hyderabaddie");
  if (has("century")) out.add("ambany");
  if (total >= 40) out.add("chennay");
  if (total >= 100) out.add("arajastan");
  if (total >= 200) out.add("delly");
  if (total >= 320) out.add("kolkaty");
  if (total >= 450) out.add("india");
  if (total >= 250) out.add("newzealand");
  if (total >= 400) out.add("australia");
  if (total >= 440) out.add("royal49");
  if (streak >= 3) out.add("srilanka");
  if (streak >= 7) out.add("westindies");
  if (streak >= 14) out.add("bangladesh");
  if (streak >= 30) out.add("england");
  if (tiers.length === QUESTIONS_PER_DAY && tiers.every((t) => (TIER_POINTS[t] ?? 0) >= 40))
    out.add("southafrica");
  return [...out];
}
export const ALL_MASCOTS = [
  "default", "flops", "pathetic", "gujratty", "hyderabaddie", "ambany",
  "chennay", "arajastan", "delly", "kolkaty", "india", "srilanka",
  "westindies", "bangladesh", "england", "newzealand", "australia",
  "royal49", "southafrica", "gold",
];
