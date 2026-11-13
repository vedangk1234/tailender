// Daily rollover is midnight IST (UTC+5:30).

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** YYYY-MM-DD for the current IST day — used as the "played today" key. */
export function istDateKey(d: Date = new Date()): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Milliseconds remaining until the next midnight IST. */
export function msUntilNextIstMidnight(): number {
  const istMs = Date.now() + IST_OFFSET_MS;
  const ist = new Date(istMs);
  const nextMidnight = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.max(0, nextMidnight - istMs);
}
