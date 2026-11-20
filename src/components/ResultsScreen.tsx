import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Home, ChevronDown } from "lucide-react";
import { buildShareText, MAX_DAILY_SCORE, TIERS, TIER_ORDER, type TierId } from "@/lib/scoring";
import type { ScoreItem } from "@/lib/api";
import { TierBadge } from "./TierBadge";

export function ResultsScreen({
  items,
  total,
  puzzleNumber,
  onHome,
}: {
  items: ScoreItem[];
  total: number;
  puzzleNumber: number;
  onHome: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const tiers = items.map((i) => i.tier as TierId);

  const shareText = buildShareText({
    puzzleNumber,
    totalScore: total,
    tiers,
    shareUrl: "https://tailender.game",
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-dvh w-full max-w-[797px] flex-col gap-6 px-4 py-9"
    >
      <div className="brut seam rounded-2xl bg-cobalt px-6 py-6 text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/70">
          Tailender #{puzzleNumber} · Final
        </p>
        <div className="font-display text-7xl leading-none tabular-nums">
          {total}
          <span className="text-3xl text-paper/60">/{MAX_DAILY_SCORE}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <ResultRow key={i} item={it} index={i} delay={0.06 * i} />
        ))}
      </div>

      <div className="brut rounded-2xl bg-paper p-5">
        <div className="font-mono text-sm leading-relaxed text-ink">
          <div className="font-bold">
            Tailender #{puzzleNumber} · {total}/{MAX_DAILY_SCORE}
          </div>
          <div className="my-2 text-2xl tracking-wide">
            {tiers.map((t) => TIERS[t].emoji).join(" ")}
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
        Come back tomorrow for #{puzzleNumber + 1}
      </p>
    </motion.div>
  );
}

function ResultRow({ item, index, delay }: { item: ScoreItem; index: number; delay: number }) {
  const [open, setOpen] = useState(false);
  const answers = item.answers ?? [];
  const byTier = new Map<TierId, string[]>();
  for (const a of answers) {
    const arr = byTier.get(a.tier as TierId) ?? [];
    arr.push(a.display);
    byTier.set(a.tier as TierId, arr);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="brut-sm rounded-lg bg-paper"
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="font-display w-6 text-ink/40">{index + 1}</span>
        <span className="flex-1 text-sm font-semibold text-ink/75">{item.prompt}</span>
        <TierBadge id={item.tier as TierId} size="sm" showPoints={false} />
      </div>

      {answers.length > 0 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-1 border-t-2 border-ink/10 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
          >
            {open ? "Hide answers" : `See answers (${answers.length})`}
            <ChevronDown size={12} className={open ? "rotate-180" : ""} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2.5 px-3 pb-3 pt-1">
                  {TIER_ORDER.filter((t) => t !== "duck" && byTier.has(t)).map((t) => (
                    <div key={t} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span>{TIERS[t].emoji}</span>
                        <span className="font-display text-xs uppercase text-ink">{TIERS[t].label}</span>
                        <span className="font-mono text-[10px] font-bold text-ink/45">+{TIERS[t].points}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {byTier.get(t)!.map((name, j) => (
                          <span
                            key={j}
                            className="rounded border-2 border-ink/15 bg-cream px-1.5 py-0.5 text-[11px] font-semibold text-ink/80"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
