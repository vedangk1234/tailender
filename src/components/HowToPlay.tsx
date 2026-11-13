import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { LEAGUES } from "@/lib/leagues";

/** Three-card onboarding, shown when a signed-out player taps Play. */
export function HowToPlay({
  onDone,
  onSkip,
}: {
  onDone: () => void;
  onSkip: () => void;
}) {
  const [i, setI] = useState(0);
  const total = 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center px-5 py-8"
      style={{ background: "color-mix(in srgb, var(--color-ink) 55%, transparent)" }}
      onClick={onSkip}
    >
      <motion.div
        initial={{ scale: 0.9, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut seam relative w-full max-w-md rounded-2xl bg-paper p-6"
      >
        {/* Skip */}
        <button
          onClick={onSkip}
          className="absolute right-3 top-3 flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          Skip <X size={14} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="min-h-[300px]"
          >
            {i === 0 && <CardPrompts />}
            {i === 1 && <CardScoring />}
            {i === 2 && <CardLevels />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setI((n) => Math.max(0, n - 1))}
            className={`font-mono text-sm font-bold uppercase tracking-wide text-ink/60 ${
              i === 0 ? "invisible" : ""
            }`}
          >
            ◀ Back
          </button>

          <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
            {i + 1} of {total}
          </span>

          {i < total - 1 ? (
            <button
              onClick={() => setI((n) => Math.min(total - 1, n + 1))}
              className="brut-sm brut-tap rounded-lg bg-ink px-4 py-2 font-display text-sm uppercase tracking-wide text-paper"
            >
              Next ▶
            </button>
          ) : (
            <button
              onClick={onDone}
              className="brut-sm brut-tap rounded-lg bg-pitch px-4 py-2 font-display text-sm uppercase tracking-wide text-paper"
            >
              Let's play ▶
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Title({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-extrabold text-ink">
      <span className="grid size-8 place-items-center rounded-md border-2 border-ink bg-sun font-display text-base">
        {n}
      </span>
      {children}
    </h2>
  );
}

function CardPrompts() {
  return (
    <div>
      <Title n={1}>The prompts</Title>
      <div className="mt-3 inline-flex items-center gap-2 rounded-md border-2 border-ink bg-cherry px-2.5 py-1 font-mono text-sm font-bold text-paper">
        ⏱ 0:30
      </div>
      <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink/80">
        <b>5 cricket prompts.</b> Name one valid answer for each — a player, team,
        ground or captain — before the clock runs out.
      </p>
    </div>
  );
}

function ExampleRow({
  team,
  tier,
  pts,
  bg,
  fg,
}: {
  team: string;
  tier: string;
  pts: number;
  bg: string;
  fg: string;
}) {
  return (
    <div className="flex items-center gap-2 border-t-2 border-ink/10 py-2 first:border-t-0">
      <span className="flex-1 font-semibold text-ink">{team}</span>
      <span
        className="rounded border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
        style={{ background: bg, color: fg }}
      >
        {tier}
      </span>
      <span className="w-8 text-right font-mono text-sm font-bold tabular-nums text-ink">
        {pts}
      </span>
    </div>
  );
}

function CardScoring() {
  return (
    <div>
      <Title n={2}>Scoring</Title>
      <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink/80">
        The <b>rarer</b> your answer, the more it scores.
      </p>

      <div className="mt-4 rounded-xl border-2 border-ink bg-bone p-3">
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50">
          Example · name a team MS Dhoni has played for
        </p>
        <ExampleRow team="India" tier="Single" pts={10} bg="#bcd0e0" fg="#141210" />
        <ExampleRow team="Chennai Super Kings" tier="Boundary" pts={40} bg="#2f8f4e" fg="#fcf8ee" />
        <ExampleRow team="Rising Pune Supergiant" tier="Century" pts={100} bg="#d81f3c" fg="#fcf8ee" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        Everyone says <b>India</b>, so it scores little. Find the answer nobody
        else thinks of.
      </p>
    </div>
  );
}

function CardLevels() {
  return (
    <div>
      <Title n={3}>Levels</Title>
      <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink/80">
        Climb from <b>Gully cricket</b> all the way to{" "}
        <b>International cricket</b> — then share your scorecard with your mates.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {LEAGUES.map((l, idx) => (
          <div key={l.id} className="flex items-center gap-2">
            <div className="brut-sm flex flex-col items-center gap-1 rounded-lg bg-paper px-3 py-2">
              <span className="text-xl">{l.icon}</span>
              <span className="font-mono text-[9px] font-bold uppercase text-ink/70">
                {l.short}
              </span>
            </div>
            {idx < LEAGUES.length - 1 && <span className="text-ink/40">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
