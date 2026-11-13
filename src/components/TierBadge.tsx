import { TIERS, type TierId } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import duckImg from "@/assets/duck-emoji.png";

// Flat, punchy fills for the brutalist palette.
const TIER_COLOR: Record<TierId, { bg: string; fg: string }> = {
  duck: { bg: "#c9c1ad", fg: "#141210" },
  single: { bg: "#bcd0e0", fg: "#141210" },
  double: { bg: "#7fc6e8", fg: "#141210" },
  boundary: { bg: "#2f8f4e", fg: "#fcf8ee" },
  half_century: { bg: "#ffc83d", fg: "#141210" },
  six: { bg: "#2b4bff", fg: "#fcf8ee" },
  century: { bg: "#d81f3c", fg: "#fcf8ee" },
};

export function tierColor(id: TierId) {
  return TIER_COLOR[id].bg;
}

export function TierBadge({
  id,
  size = "md",
  showPoints = true,
}: {
  id: TierId;
  size?: "sm" | "md" | "lg";
  showPoints?: boolean;
}) {
  const tier = TIERS[id];
  const c = TIER_COLOR[id];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border-[2.5px] border-ink font-bold uppercase",
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3.5 py-1.5 text-sm shadow-[3px_3px_0_#141210]",
        size === "lg" && "px-6 py-3 text-xl shadow-[5px_5px_0_#141210]"
      )}
      style={{ background: c.bg, color: c.fg }}
    >
      {id === "duck" ? (
        <img
          src={duckImg}
          alt="Duck"
          className={cn(
            "object-contain",
            size === "sm" && "h-4 w-4",
            size === "md" && "h-5 w-5",
            size === "lg" && "h-7 w-7"
          )}
        />
      ) : (
        <span className={cn(size === "lg" ? "text-2xl" : "text-base")}>{tier.emoji}</span>
      )}
      <span className="tracking-wide">{tier.label}</span>
      {showPoints && (
        <span className="font-mono tabular-nums opacity-80">+{tier.points}</span>
      )}
    </div>
  );
}
