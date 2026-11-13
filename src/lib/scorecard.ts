import type { TierId } from "./scoring";
import { istDateKey } from "./time";

export interface ScoreItem {
  prompt: string;
  tier: TierId;
  display: string | null;
}

export interface Scorecard {
  date: string;
  total: number;
  items: ScoreItem[];
}

const KEY = "tailender.scorecard";

export function saveScorecard(sc: Scorecard) {
  localStorage.setItem(KEY, JSON.stringify(sc));
}

/** The stored scorecard, but only if it's from the current IST day. */
export function loadTodayScorecard(): Scorecard | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const sc = JSON.parse(raw) as Scorecard;
    return sc.date === istDateKey() ? sc : null;
  } catch {
    return null;
  }
}
