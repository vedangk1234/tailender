// Progression ladder — cumulative score across the day's questions promotes the
// player up through cricket's levels. Points carry forward (a 50 fills Gully and
// spills into Club). Ranges are internal; the UI shows a bar + the next league,
// never raw numbers.

import { MAX_DAILY_SCORE } from "./scoring";

export interface League {
  id: string;
  name: string;
  short: string;
  /** inclusive lower bound of cumulative score */
  min: number;
  /** pixel-badge emoji stand-in (real badges later) */
  icon: string;
}

export const LEAGUES: League[] = [
  { id: "gully", name: "Gully cricket", short: "Gully", min: 0, icon: "🏟️" },
  { id: "club", name: "Club cricket", short: "Club", min: 40, icon: "🏏" },
  { id: "county", name: "County cricket", short: "County", min: 100, icon: "🎽" },
  { id: "ranji", name: "Ranji Trophy", short: "Ranji", min: 200, icon: "🏆" },
  { id: "ipl", name: "Indian Premier League", short: "IPL", min: 320, icon: "🪔" },
  { id: "intl", name: "International cricket", short: "International", min: 450, icon: "🌍" },
];

/** Index of the league a cumulative total currently sits in. */
export function leagueIndexFor(total: number): number {
  let idx = 0;
  for (let i = 0; i < LEAGUES.length; i++) {
    if (total >= LEAGUES[i].min) idx = i;
  }
  return idx;
}

export function leagueFor(total: number): League {
  return LEAGUES[leagueIndexFor(total)];
}

export function nextLeague(total: number): League | null {
  const idx = leagueIndexFor(total);
  return idx < LEAGUES.length - 1 ? LEAGUES[idx + 1] : null;
}

/** Points still needed to reach the next league (0 if already at the top). */
export function pointsToNext(total: number): number {
  const next = nextLeague(total);
  return next ? Math.max(0, next.min - total) : 0;
}

/** 0–1 fill of the whole ladder bar (cumulative total over the max). */
export function ladderFill(total: number): number {
  return Math.min(1, total / MAX_DAILY_SCORE);
}

/** Where each league badge sits along the ladder bar, as a 0–1 fraction. */
export function leagueMarker(league: League): number {
  return league.min / MAX_DAILY_SCORE;
}
