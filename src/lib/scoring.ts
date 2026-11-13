// Tailender scoring tiers — the heart of the game.
// Obvious answers score least; the rarest valid answer is a Century.

export type TierId =
  | "duck"
  | "single"
  | "double"
  | "boundary"
  | "half_century"
  | "six"
  | "century";

export interface Tier {
  id: TierId;
  label: string;
  points: number;
  /** Emoji used on the share card. */
  emoji: string;
}

export const TIERS: Record<TierId, Tier> = {
  duck: { id: "duck", label: "Duck", points: 0, emoji: "🦆" },
  single: { id: "single", label: "Single run", points: 10, emoji: "🔟" },
  double: { id: "double", label: "Double run", points: 20, emoji: "🕑" },
  boundary: { id: "boundary", label: "Boundary", points: 40, emoji: "🪢" },
  half_century: { id: "half_century", label: "Half Century", points: 50, emoji: "✋🏼" },
  six: { id: "six", label: "THAT'S A SIX", points: 60, emoji: "🏏" },
  century: { id: "century", label: "Century", points: 100, emoji: "💯" },
};

/** Ordered obvious → rarest. */
export const TIER_ORDER: TierId[] = [
  "duck",
  "single",
  "double",
  "boundary",
  "half_century",
  "six",
  "century",
];

export const QUESTIONS_PER_DAY = 5;
export const SECONDS_PER_QUESTION = 30;
export const MAX_DAILY_SCORE = 500;

export function tierPoints(id: TierId): number {
  return TIERS[id].points;
}

/** Build the Wordle-style share text for a completed daily. */
export function buildShareText(opts: {
  puzzleNumber: number;
  totalScore: number;
  tiers: TierId[]; // one per question, in order
  shareUrl: string;
}): string {
  const row = opts.tiers.map((t) => TIERS[t].emoji).join(" ");
  return [
    `Tailender #${opts.puzzleNumber} · ${opts.totalScore}/${MAX_DAILY_SCORE}`,
    row,
    opts.shareUrl,
  ].join("\n");
}
