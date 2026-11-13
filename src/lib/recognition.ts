// Layer 1 — Recognition. Resolve free-typed text to a known entity.
// NOTE: for the vertical slice this runs client-side against a mock roster.
// In production this logic lives server-side (Supabase Edge Function) so the
// valid-answer list and tiers never reach the browser.

export interface Entity {
  id: string;
  canonical: string;
  aliases: string[];
}

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[.'`’_-]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Damerau–Levenshtein edit distance (handles transpositions e.g. kolhi→kohli). */
export function editDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const d: number[][] = Array.from({ length: al + 1 }, () =>
    new Array(bl + 1).fill(0)
  );
  for (let i = 0; i <= al; i++) d[i][0] = i;
  for (let j = 0; j <= bl; j++) d[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[al][bl];
}

/** Typo tolerance scales with word length. */
function tolerance(len: number): number {
  if (len <= 4) return 1;
  if (len <= 8) return 2;
  return 3;
}

/**
 * Resolve typed text to an entity id, or null if unrecognised.
 * Exact alias match first, then nearest fuzzy match within tolerance.
 */
export function resolveEntity(input: string, roster: Entity[]): string | null {
  const q = normalize(input);
  if (!q) return null;

  // Exact match against canonical + aliases.
  for (const e of roster) {
    const forms = [e.canonical, ...e.aliases].map(normalize);
    if (forms.includes(q)) return e.id;
  }

  // Fuzzy: nearest alias within tolerance.
  let best: { id: string; dist: number } | null = null;
  for (const e of roster) {
    const forms = [e.canonical, ...e.aliases].map(normalize);
    for (const f of forms) {
      const dist = editDistance(q, f);
      if (dist <= tolerance(f.length) && (!best || dist < best.dist)) {
        best = { id: e.id, dist };
      }
    }
  }
  return best?.id ?? null;
}
