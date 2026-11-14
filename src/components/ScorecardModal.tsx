import { useMemo } from "react";
import { motion } from "motion/react";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  MAX_DAILY_SCORE,
  TIERS,
  TIER_ORDER,
  buildShareText,
  type TierId,
} from "@/lib/scoring";
import { leagueFor } from "@/lib/leagues";
import type { ScoreItem } from "@/lib/api";
import { mascotById } from "@/data/mascots";
import { tierColor } from "./TierBadge";

/** Big flip-clock-style tiles for the final score. */
function ScoreTiles({ score }: { score: number }) {
  const digits = String(score).padStart(3, "0").split("");
  return (
    <div className="flex gap-1.5">
      {digits.map((d, i) => (
        <span
          key={i}
          className="relative grid h-16 w-12 place-items-center overflow-hidden rounded-lg border-2 border-ink bg-ink font-mono text-4xl font-bold tabular-nums text-sun"
        >
          {d}
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/50" />
        </span>
      ))}
    </div>
  );
}

function HighlightRow({ item }: { item: ScoreItem }) {
  const tier = TIERS[item.tier as TierId];
  const scored = item.tier !== "duck";
  const color = tierColor(item.tier as TierId);
  return (
    <div className="brut-sm flex items-center gap-3 rounded-xl bg-paper px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[11px] uppercase tracking-wide text-ink/55">
          {item.prompt}
        </p>
        <p className="truncate text-lg font-extrabold text-ink">
          {item.display ?? "No answer"}
        </p>
        <span
          className="mt-1 inline-block rounded border-2 border-ink px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase"
          style={{ background: color, color: item.tier === "duck" || item.tier === "single" || item.tier === "double" || item.tier === "half_century" ? "#141210" : "#fcf8ee" }}
        >
          {tier.label}
        </span>
      </div>
      <div
        className="flex shrink-0 items-center gap-1 font-mono text-lg font-bold"
        style={{ color: scored ? "var(--color-pitch-deep)" : "var(--color-ball-red)" }}
      >
        {scored ? <Check size={18} /> : <X size={18} />}
        +{tier.points}
      </div>
    </div>
  );
}

export function ScorecardModal({
  items,
  total,
  puzzleNumber,
  selectedId,
  onClose,
}: {
  items: ScoreItem[];
  total: number;
  puzzleNumber: number;
  selectedId: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const league = leagueFor(total);
  const mascot = mascotById(selectedId);

  // Best answers first.
  const ordered = useMemo(
    () =>
      [...items].sort(
        (a, b) => TIER_ORDER.indexOf(b.tier as TierId) - TIER_ORDER.indexOf(a.tier as TierId)
      ),
    [items]
  );

  async function share() {
    const text = buildShareText({
      puzzleNumber,
      totalScore: total,
      tiers: items.map((i) => i.tier as TierId),
      shareUrl: "https://tailender.game",
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-6"
      style={{ background: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut ground-card my-auto w-full max-w-lg rounded-3xl p-5 sm:p-6"
      >
        {/* Header: close */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/55">
              Today's scorecard · #{puzzleNumber}
            </p>
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink">
              Final whistle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="brut-sm brut-tap grid size-9 place-items-center rounded-lg bg-paper text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top: mascot + big score + level reached */}
        <div className="brut-sm flex items-center gap-4 rounded-2xl bg-paper p-5">
          <img
            src={mascot.img}
            alt={mascot.name}
            className="h-28 w-auto shrink-0 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="flex flex-1 flex-col items-center gap-3">
            <ScoreTiles score={total} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50">
              out of {MAX_DAILY_SCORE}
            </span>
            <span className="rounded-lg border-2 border-ink bg-sun px-3 py-1 text-center font-display text-sm uppercase tracking-wide text-ink">
              You reached · {league.name}
            </span>
          </div>
        </div>

        {/* Match highlights */}
        <div className="mb-2 mt-5 flex items-baseline justify-between">
          <h3 className="font-display text-lg uppercase tracking-tight text-ink">
            Match highlights
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            Best answers first
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {ordered.map((item, i) => (
            <HighlightRow key={i} item={item} />
          ))}
        </div>

        {/* Share */}
        <button
          onClick={share}
          className="brut-sm brut-tap mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-pitch py-3 font-display text-base uppercase tracking-wide text-paper"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "Copied!" : "Share result"}
        </button>

        <a
          href="mailto:hello@tailender.game?subject=Tailender%20question%20report&body=Puzzle%20%231%20%E2%80%94%20what%27s%20wrong%3A%0A%0A"
          className="mt-3 block text-center font-mono text-[10px] font-bold uppercase tracking-widest text-ink/45 hover:text-ink"
        >
          ⚑ Report a problem with this quiz
        </a>
      </motion.div>
    </motion.div>
  );
}
