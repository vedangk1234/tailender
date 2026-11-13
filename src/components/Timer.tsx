import { SECONDS_PER_QUESTION } from "@/lib/scoring";

/** Brutalist timer: a bold bordered box with a seam-coloured progress stripe.
 *  Flips to cherry-red in the final seconds. */
export function Timer({ timeLeft }: { timeLeft: number }) {
  const frac = Math.max(0, timeLeft) / SECONDS_PER_QUESTION;
  const danger = timeLeft <= 7;

  return (
    <div
      className="brut-sm relative grid size-14 place-items-center overflow-hidden rounded-lg"
      style={{ background: danger ? "var(--color-cherry)" : "var(--color-paper)" }}
    >
      <span
        className="font-mono text-2xl font-bold tabular-nums"
        style={{ color: danger ? "var(--color-paper)" : "var(--color-ink)" }}
      >
        {Math.max(0, timeLeft)}
      </span>
      <span
        className="absolute inset-x-0 bottom-0 h-1.5"
        style={{
          background: danger ? "var(--color-paper)" : "var(--color-pitch)",
          width: `${frac * 100}%`,
          transition: "width 1s linear",
        }}
      />
    </div>
  );
}
