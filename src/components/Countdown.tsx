import { useEffect, useState } from "react";
import { msUntilNextIstMidnight } from "@/lib/time";

function parts(ms: number): [string, string, string] {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")) as [string, string, string];
}

/** A single flip-clock digit tile: dark, rounded, with a centre split line. */
function Digit({ d }: { d: string }) {
  return (
    <span className="relative grid h-9 w-7 place-items-center overflow-hidden rounded-md border-2 border-ink bg-ink font-mono text-xl font-bold tabular-nums text-cream">
      {d}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/50" />
    </span>
  );
}

function Pair({ value }: { value: string }) {
  return (
    <span className="flex gap-1">
      <Digit d={value[0]} />
      <Digit d={value[1]} />
    </span>
  );
}

function Colon() {
  return <span className="font-mono text-2xl font-bold text-ink/60">:</span>;
}

/** Flip-clock countdown to the next midnight-IST reset. */
export function Countdown() {
  const [ms, setMs] = useState(() => msUntilNextIstMidnight());

  useEffect(() => {
    const id = setInterval(() => setMs(msUntilNextIstMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const [h, m, s] = parts(ms);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
        Next Tailender in
      </span>
      <div className="flex items-center gap-1.5">
        <Pair value={h} />
        <Colon />
        <Pair value={m} />
        <Colon />
        <Pair value={s} />
      </div>
    </div>
  );
}
