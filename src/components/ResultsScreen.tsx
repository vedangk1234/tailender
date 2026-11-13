import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Home } from "lucide-react";
import {
  buildShareText,
  MAX_DAILY_SCORE,
  TIERS,
  tierPoints,
  type TierId,
} from "@/lib/scoring";
import { PUZZLE_NUMBER, DAILY_QUESTIONS } from "@/data/mockDaily";
import { TierBadge } from "./TierBadge";

export function ResultsScreen({
  results,
  onHome,
}: {
  results: TierId[];
  onHome: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const total = useMemo(
    () => results.reduce((s, t) => s + tierPoints(t), 0),
    [results]
  );

  const shareText = buildShareText({
    puzzleNumber: PUZZLE_NUMBER,
    totalScore: total,
    tiers: results,
    shareUrl: "https://tailender.game",
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op for the slice */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-dvh w-full max-w-[797px] flex-col gap-6 px-4 py-9"
    >
      {/* Score headline */}
      <div className="brut seam rounded-2xl bg-cobalt px-6 py-6 text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
          Tailender #{PUZZLE_NUMBER} · Final
        </p>
        <div className="font-display text-7xl leading-none tabular-nums">
          {total}
          <span className="text-3xl text-paper/60">/{MAX_DAILY_SCORE}</span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="flex flex-col gap-2">
        {results.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i }}
            className="brut-sm flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5"
          >
            <span className="font-display w-6 text-ink/40">{i + 1}</span>
            <span className="flex-1 truncate text-sm font-semibold text-ink/75">
              {DAILY_QUESTIONS[i].prompt}
            </span>
            <TierBadge id={t} size="sm" showPoints={false} />
          </motion.div>
        ))}
      </div>

      {/* Share card */}
      <div className="brut rounded-2xl bg-paper p-5">
        <div className="font-mono text-sm leading-relaxed text-ink">
          <div className="font-bold">
            Tailender #{PUZZLE_NUMBER} · {total}/{MAX_DAILY_SCORE}
          </div>
          <div className="my-2 text-2xl tracking-wide">
            {results.map((t) => TIERS[t].emoji).join(" ")}
          </div>
          <div className="text-pitch-deep">tailender.game</div>
        </div>

        <button
          onClick={copy}
          className="brut brut-tap mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pitch py-3.5 font-display text-lg uppercase tracking-wide text-paper"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? "Copied!" : "Share result"}
        </button>
      </div>

      <button
        onClick={onHome}
        className="brut-sm brut-tap flex w-full items-center justify-center gap-2 rounded-xl bg-paper py-3 font-display text-base uppercase tracking-wide text-ink"
      >
        <Home size={18} /> Home
      </button>

      <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
        Come back tomorrow for #{PUZZLE_NUMBER + 1}
      </p>
    </motion.div>
  );
}
