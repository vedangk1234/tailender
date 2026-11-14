import { motion } from "motion/react";
import { KangarooCrest } from "./Mascots";
import { GoogleSignIn } from "./GoogleSignIn";
import { Countdown } from "./Countdown";
import {
  MAX_DAILY_SCORE,
  QUESTIONS_PER_DAY,
  SECONDS_PER_QUESTION,
  TIERS,
} from "@/lib/scoring";
import { mascotById } from "@/data/mascots";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
const now = new Date();
const opts = { timeZone: "Asia/Kolkata" } as const;
const weekday = now.toLocaleDateString("en-IN", { weekday: "long", ...opts }).toUpperCase();
const dayMonth = `${ordinal(Number(now.toLocaleDateString("en-IN", { day: "numeric", ...opts })))} ${now
  .toLocaleDateString("en-IN", { month: "long", ...opts })
  .toUpperCase()}`;

export function StartScreen({
  onStart,
  isGuest,
  onSignIn,
  selectedId,
  onOpenMascots,
  onOpenLeaderboard,
  streak,
  playsToday,
  topToday,
  puzzleNumber,
  playedToday,
  dayScore,
  onViewScorecard,
}: {
  onStart: () => void;
  isGuest: boolean;
  onSignIn: () => void;
  selectedId: string;
  onOpenMascots: () => void;
  onOpenLeaderboard: () => void;
  streak: number;
  playsToday: number;
  topToday: number;
  puzzleNumber: number;
  playedToday: boolean;
  dayScore: number;
  onViewScorecard: () => void;
}) {
  const mascot = mascotById(selectedId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-4 py-6 lg:h-dvh lg:overflow-hidden"
    >
      <h2
        className="font-display max-w-[797px] text-balance text-center text-3xl uppercase leading-tight tracking-tight text-cream sm:text-4xl"
        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(0,0,0,0.4)" }}
      >
        What is your Batting Average?
      </h2>

      <div className="flex w-full max-w-[1536px] flex-col items-center justify-center gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Left — equipped mascot (desktop), slow hover + ground shadow */}
        <aside className="order-2 hidden shrink-0 flex-col items-center justify-center gap-2 lg:order-1 lg:flex lg:w-auto lg:self-end">
          <span
            className="font-display text-xl uppercase tracking-wide text-cream"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}
          >
            Your mascot
          </span>
          <motion.img
            src={mascot.img}
            alt={mascot.name}
            className="h-56 w-auto object-contain lg:h-72"
            style={{ imageRendering: "pixelated" }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="-mt-1 h-3 w-28 rounded-[50%] bg-black/35 blur-[3px] lg:w-40"
            animate={{ scaleX: [1, 0.8, 1], opacity: [0.4, 0.22, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-center text-base font-extrabold text-cream"
            style={{ textShadow: "0 1px 5px rgba(0,0,0,0.75)" }}
          >
            {mascot.name}
          </span>
        </aside>

        {/* Centre — main card */}
        <div className="brut ground-card order-1 flex w-full max-w-[797px] flex-col gap-5 rounded-3xl p-6 lg:order-2">
          <div className="flex items-start justify-between gap-3">
            <div className="leading-none">
              <div className="font-display text-xl uppercase text-ink">{weekday}</div>
              <div className="font-display text-xl uppercase text-ink/80">{dayMonth}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="flex items-center gap-2 text-right font-mono text-[11px] font-bold uppercase tracking-wide text-ink/70">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f9d4d] opacity-80" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#1f9d4d]" />
                </span>
                {playsToday.toLocaleString("en-IN")} played today · top {topToday}
              </span>
              {streak > 0 && (
                <div className="brut-sm rounded-lg bg-sun px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-ink">
                  🔥 {streak}-day
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <KangarooCrest className="size-14 shrink-0 text-3xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
                  Tailender
                </h1>
                <span className="-mt-1 inline-block rotate-6 rounded border-2 border-ink bg-sun px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink">
                  Beta
                </span>
              </div>
              <span className="mt-1 inline-block rounded border-2 border-ink bg-cherry px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
                Daily Cricket · #{puzzleNumber}
              </span>
            </div>
          </div>

          <h2 className="text-balance text-xl font-extrabold leading-snug text-ink">
            The <span className="bg-sun px-1">obvious answer</span> scores least. Dig deep — name the one nobody else will.
          </h2>

          {/* Mobile mascots access */}
          <button
            onClick={onOpenMascots}
            className="brut-sm brut-tap flex items-center gap-3 rounded-2xl bg-paper p-3 text-left lg:hidden"
          >
            <img
              src={mascot.img}
              alt={mascot.name}
              className="h-14 w-auto shrink-0 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="flex-1">
              <div className="font-display text-lg uppercase leading-none text-ink">Mascots</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                {mascot.name} · tap to change
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase text-ink/50">20 →</span>
          </button>

          {/* Instructions, or today's score if played */}
          <div className="brut-sm seam rounded-2xl bg-paper p-5">
            {playedToday ? (
              <div className="flex items-center justify-center gap-5 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/55">
                    You've played today
                  </span>
                  <div className="font-display text-4xl leading-none tabular-nums text-ink">
                    {dayScore}
                    <span className="text-xl text-ink/40">/{MAX_DAILY_SCORE}</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onViewScorecard}
                  className="brut-sm brut-tap rounded-lg bg-cobalt px-4 py-2.5 font-display text-sm uppercase tracking-wide text-paper"
                >
                  ▸ View scorecard
                </motion.button>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 text-sm font-semibold text-ink">
                <li className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded border-2 border-ink bg-pitch font-mono text-xs text-paper">5</span>
                  {QUESTIONS_PER_DAY} questions · {SECONDS_PER_QUESTION} seconds each
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded border-2 border-ink bg-cherry text-xs">{TIERS.century.emoji}</span>
                  Rarer answers score more
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded border-2 border-ink bg-sun text-xs">{TIERS.duck.emoji}</span>
                  Out of time with no answer? That's a Duck (0)
                </li>
              </ul>
            )}
          </div>

          {playedToday && (
            <div className="brut-sm rounded-2xl bg-paper p-4">
              <Countdown />
            </div>
          )}

          {isGuest && (
            <div className="brut-sm rounded-2xl bg-cobalt p-4 text-paper">
              <p className="mb-3 text-center text-sm font-bold">
                🔥 Start a streak today — sign in to save it.
              </p>
              <GoogleSignIn onClick={onSignIn} />
            </div>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            onClick={onStart}
            className="brut-sm brut-tap rounded-xl bg-ink py-4 font-display text-2xl uppercase tracking-wide text-paper"
          >
            {playedToday ? "▸ Play again (practice)" : `▸ Play Tailender #${puzzleNumber}`}
          </motion.button>

          <button
            onClick={onOpenLeaderboard}
            className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-ink"
          >
            🏆 View leaderboard
          </button>
        </div>

        {/* Right — Mascots button (desktop) */}
        <motion.button
          whileHover={{ y: -2 }}
          onClick={onOpenMascots}
          className="brut brut-tap ground-card order-3 hidden w-full shrink-0 flex-row items-center justify-center gap-4 rounded-2xl p-5 lg:flex lg:w-80 lg:min-h-[220px]"
        >
          <img
            src={mascotById("gold").img}
            alt=""
            className="h-20 w-auto shrink-0 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="font-display text-3xl uppercase leading-none tracking-tight text-ink">
              Mascots
            </span>
            <span className="rounded border-2 border-ink bg-sun px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
              20 to collect
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/60">
              Tap to open →
            </span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
