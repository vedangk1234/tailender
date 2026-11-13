import { motion } from "motion/react";
import {
  LEAGUES,
  ladderFill,
  leagueFor,
  leagueIndexFor,
  leagueMarker,
  nextLeague,
} from "@/lib/leagues";

// Cumulative progression ladder. Fill animates from the previous total to the
// new one; no raw numbers shown — just the bar, the current level, and the next.
export function LeagueBar({ total, prevTotal }: { total: number; prevTotal: number }) {
  const current = leagueFor(total);
  const currentIdx = leagueIndexFor(total);
  const next = nextLeague(total);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50">
            Your level
          </p>
          <p className="font-display text-lg uppercase leading-none text-ink">
            {current.name}
          </p>
        </div>
        <p className="text-right font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50">
          {next ? (
            <>
              Next
              <br />
              <span className="text-ink/80">{next.name}</span>
            </>
          ) : (
            <span className="text-pitch-deep">Top level 🏆</span>
          )}
        </p>
      </div>

      {/* Ladder bar */}
      <div className="relative mt-2 h-4 overflow-hidden rounded-md border-[2.5px] border-ink bg-bone">
        <motion.div
          className="absolute inset-y-0 left-0 bg-sun"
          initial={{ width: `${ladderFill(prevTotal) * 100}%` }}
          animate={{ width: `${ladderFill(total) * 100}%` }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
        />
        {/* league boundary markers */}
        {LEAGUES.slice(1).map((l) => (
          <span
            key={l.id}
            className="absolute inset-y-0 w-[2px] bg-ink/40"
            style={{ left: `${leagueMarker(l) * 100}%` }}
          />
        ))}
      </div>

      {/* Badge row */}
      <div className="mt-2 flex items-center justify-between">
        {LEAGUES.map((l, idx) => {
          const active = idx === currentIdx;
          const reached = idx <= currentIdx;
          return (
            <div
              key={l.id}
              className={`grid size-9 place-items-center rounded-md border-2 border-ink transition ${
                active ? "bg-sun shadow-[3px_3px_0_#141210]" : reached ? "bg-paper" : "bg-bone opacity-45"
              }`}
              title={l.name}
            >
              <span className="text-base">{l.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
