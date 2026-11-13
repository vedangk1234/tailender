import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ballSrc from "@/assets/ball.lottie?url";

// A top-down 22-yard pitch drawn in CSS (stumps both ends, popping + return
// creases, wide guides, mowing stripes). The leather ball rolls from the
// striker's end to a position proportional to the answer's score (0–100).

const TICKS = [10, 20, 40, 50, 60, 100];
const PAD = 5; // % inset so the ball never clips the edge
const mapLeft = (v: number) => PAD + (v / 100) * (100 - 2 * PAD);

function Stumps({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2"
      style={{ [side]: "2%" } as React.CSSProperties}
    >
      <div className="relative flex gap-[3px]">
        {[0, 1, 2].map((s) => (
          <span key={s} className="h-5 w-[3px] rounded-sm bg-ink" />
        ))}
        {/* bails */}
        <span className="absolute -top-[3px] left-0 h-[3px] w-full bg-ink" />
      </div>
    </div>
  );
}

export function CricketPitchBar({
  score,
  tierLabel,
}: {
  score: number;
  tierLabel: string;
}) {
  const target = mapLeft(Math.max(0, Math.min(100, score)));

  return (
    <div className="relative w-full select-none pt-9 pb-6">
      {/* Tier flag that rides above the ball */}
      <motion.div
        className="absolute top-0 z-20 -translate-x-1/2"
        initial={{ left: `${mapLeft(0)}%`, opacity: 0 }}
        animate={{ left: `${target}%`, opacity: 1 }}
        transition={{ left: { duration: 1.1, ease: "easeOut", delay: 0.15 }, opacity: { duration: 0.3 } }}
      >
        <div className="brut-sm whitespace-nowrap rounded-md bg-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-paper">
          {tierLabel}
        </div>
        <div className="mx-auto h-2 w-[2px] bg-ink" />
      </motion.div>

      {/* The pitch */}
      <div
        className="relative h-12 overflow-hidden rounded-md border-[2.5px] border-ink"
        style={{
          background:
            "repeating-linear-gradient(90deg,#d9c48f 0 14px,#d2bb82 14px 28px)",
        }}
      >
        {/* popping creases + wide guides (white lines) */}
        {[10, 90].map((p) => (
          <span
            key={`pop-${p}`}
            className="absolute top-0 h-full w-[2px] bg-paper/80"
            style={{ left: `${p}%` }}
          />
        ))}
        {[16, 84].map((p) => (
          <span
            key={`wide-${p}`}
            className="absolute top-0 h-full w-[1px] bg-paper/50"
            style={{ left: `${p}%` }}
          />
        ))}
        {/* return creases (short horizontals by the stumps) */}
        {[4, 96].map((p) => (
          <span key={`ret-${p}`}>
            <span className="absolute h-[2px] w-[9%] bg-paper/70" style={{ left: `${p - 4}%`, top: "26%" }} />
            <span className="absolute h-[2px] w-[9%] bg-paper/70" style={{ left: `${p - 4}%`, top: "70%" }} />
          </span>
        ))}

        <Stumps side="left" />
        <Stumps side="right" />

        {/* The rolling leather ball */}
        <motion.div
          className="absolute top-1/2 z-10 size-9 -translate-x-1/2 -translate-y-1/2"
          initial={{ left: `${mapLeft(0)}%` }}
          animate={{ left: `${target}%` }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
        >
          <DotLottieReact src={ballSrc} autoplay loop />
        </motion.div>
      </div>

      {/* Tier ticks */}
      <div className="relative mt-1 h-4">
        {TICKS.map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2 font-mono text-[9px] font-bold tabular-nums text-ink/45"
            style={{ left: `${mapLeft(t)}%` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
