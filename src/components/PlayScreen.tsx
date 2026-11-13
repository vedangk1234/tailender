import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import confettiSrc from "@/assets/confetti.lottie?url";
import type { GameState } from "@/game/useGame";
import { TIERS, tierPoints } from "@/lib/scoring";
import { leagueFor, leagueIndexFor } from "@/lib/leagues";
import { playScore, playCentury, playDuck } from "@/lib/sound";
import { Timer } from "./Timer";
import { TierBadge, tierColor } from "./TierBadge";
import { CricketPitchBar } from "./CricketPitchBar";
import { LeagueBar } from "./LeagueBar";
import { DuckWalk } from "./Mascots";

export function PlayScreen({ game }: { game: GameState }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (game.phase === "playing") {
      setText("");
      inputRef.current?.focus();
    }
  }, [game.phase, game.qIndex]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || game.phase !== "playing") return;
    const outcome = game.submitGuess(text);
    if (outcome.kind !== "scored") {
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[797px] flex-col justify-center px-4 py-8">
      {/* One big "ground" card holding the question flow */}
      <div className="brut ground-card flex flex-col rounded-3xl p-5">
        {/* Progress blocks + timer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: game.total }).map((_, i) => {
              const done = i < game.results.length;
              const current = i === game.qIndex;
              return (
                <span
                  key={i}
                  className="h-3 w-7 rounded-sm border-2 border-ink"
                  style={{
                    background: done
                      ? tierColor(game.results[i])
                      : current
                      ? "var(--color-ink)"
                      : "var(--color-paper)",
                  }}
                />
              );
            })}
          </div>
          <Timer timeLeft={game.timeLeft} />
        </div>

        {/* Question */}
        <div className="flex flex-col py-6">
          <span className="inline-flex w-max items-center rounded border-2 border-ink bg-pitch px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-paper">
            Question {game.qIndex + 1} of {game.total}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-extrabold leading-tight text-ink">
            {game.question.prompt}
          </h2>

          <form onSubmit={handleSubmit} className="mt-7">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (game.feedback) game.clearFeedback();
            }}
            disabled={game.phase !== "playing"}
            placeholder="Type a name…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            className="brut-sm w-full rounded-lg bg-paper px-4 py-4 text-lg font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/35 focus:border-cobalt"
          />

          <div className="mt-3 h-9">
            <AnimatePresence mode="wait">
              {game.feedback && (
                <motion.p
                  key={
                    game.feedback.kind +
                    (game.feedback.kind === "recognised_wrong" ? game.feedback.display : "")
                  }
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 rounded border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide"
                  style={{
                    background:
                      game.feedback.kind === "recognised_wrong"
                        ? "var(--color-orange-cap)"
                        : "#c9c1ad",
                    color: "var(--color-ink)",
                  }}
                >
                  {game.feedback.kind === "recognised_wrong"
                    ? "Recognised player. Not in the list."
                    : "Did not recognize the player."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={game.phase !== "playing" || !text.trim()}
            className="brut brut-tap mt-3 w-full rounded-xl bg-ink py-3.5 font-display text-lg uppercase tracking-wide text-paper disabled:opacity-30"
          >
            Guess
          </button>
          </form>

          <button
            type="button"
            onClick={game.skipQuestion}
            disabled={game.phase !== "playing"}
            className="mx-auto mt-4 block font-mono text-xs font-bold uppercase tracking-widest text-ink/50 underline-offset-4 hover:text-ink hover:underline disabled:opacity-30"
          >
            Skip this question →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {game.phase === "reveal" && game.revealTier && (
          <TierReveal
            tier={game.revealTier}
            display={game.lastScoredDisplay}
            onContinue={game.continueNext}
            last={game.results.length >= game.total}
            total={game.results.reduce((s, t) => s + tierPoints(t), 0)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TierReveal({
  tier,
  display,
  onContinue,
  last,
  total,
}: {
  tier: GameState["revealTier"];
  display: string | null;
  onContinue: () => void;
  last: boolean;
  total: number;
}) {
  const isDuck = tier === "duck";
  const thisScore = tier ? tierPoints(tier) : 0;
  const prevTotal = total - thisScore;
  const promoted = leagueIndexFor(total) > leagueIndexFor(prevTotal);
  const newLeague = leagueFor(total);

  // Play the matching sound effect once when the reveal appears.
  useEffect(() => {
    if (tier === "century") playCentury();
    else if (tier === "duck") playDuck();
    else playScore();
  }, [tier]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto py-6"
      style={{ background: "color-mix(in srgb, var(--color-bone) 90%, transparent)" }}
    >
      {isDuck && <DuckWalk />}
      {tier === "century" && (
        <div className="pointer-events-none fixed inset-0 z-40">
          <DotLottieReact src={confettiSrc} autoplay />
        </div>
      )}
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="brut seam my-auto mx-4 w-full max-w-[765px] rounded-2xl bg-paper px-7 py-7"
      >
        {/* Cumulative league ladder */}
        <LeagueBar total={total} prevTotal={prevTotal} />

        <div className="my-4 h-[2px] bg-ink/10" />

        {/* This answer's score on the pitch */}
        {!isDuck ? (
          <CricketPitchBar score={thisScore} tierLabel={TIERS[tier!].label} />
        ) : (
          <p className="py-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            — duck · no runs —
          </p>
        )}

        <div className="mt-1 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
            {isDuck ? "No runs — that's a" : "You scored a"}
          </p>
          <div className="my-3 flex justify-center">
            <TierBadge id={tier!} size="lg" />
          </div>
          {display ? (
            <p className="text-lg font-extrabold text-ink">{display}</p>
          ) : (
            <p className="text-base font-semibold text-ink/50">No valid answer</p>
          )}

          {promoted && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 320, damping: 16 }}
              className="brut-sm mx-auto mt-4 w-max rounded-lg bg-pitch px-4 py-2 font-display text-sm uppercase tracking-wide text-paper"
            >
              ⬆ Promoted to {newLeague.name}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onContinue}
            className="brut brut-tap mt-6 w-full rounded-xl bg-cobalt py-3 font-display text-lg uppercase tracking-wide text-paper"
          >
            {last ? "See results" : "Next question"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
