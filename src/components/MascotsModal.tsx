import { motion } from "motion/react";
import { X, Check, Lock } from "lucide-react";
import { MASCOTS } from "@/data/mascots";
import { cn } from "@/lib/utils";

/** The collection: browse all 20 jerseys; equip any you've unlocked. */
export function MascotsModal({
  selectedId,
  unlocked,
  onSelect,
  onClose,
}: {
  selectedId: string;
  unlocked: string[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const owned = new Set(unlocked);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-3 py-6"
      style={{ background: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut ground-card my-auto w-full max-w-5xl rounded-3xl p-5 sm:p-7"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl uppercase tracking-tight text-ink">
              Mascots
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
              {owned.size}/20 unlocked · tap to equip
            </p>
          </div>
          <button
            onClick={onClose}
            className="brut-sm brut-tap grid size-10 place-items-center rounded-lg bg-paper text-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MASCOTS.map((m) => {
            const equipped = m.id === selectedId;
            const isOwned = owned.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => isOwned && onSelect(m.id)}
                disabled={!isOwned}
                title={!isOwned ? `Unlock: ${m.achievement}` : undefined}
                className={cn(
                  "group brut-sm brut-tap relative flex flex-col items-center gap-1 rounded-2xl bg-paper p-3 text-center",
                  equipped && "ring-4 ring-pitch",
                  !isOwned && "cursor-help"
                )}
              >
                {equipped && (
                  <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded border-2 border-ink bg-pitch px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-paper">
                    <Check size={10} /> On
                  </span>
                )}
                {!isOwned && (
                  <span className="absolute right-2 top-2 z-10 grid size-5 place-items-center rounded border-2 border-ink bg-ink text-paper transition group-hover:bg-cherry">
                    <Lock size={10} />
                  </span>
                )}
                {/* Hover reveal: how to unlock this locked mascot */}
                {!isOwned && (
                  <span className="pointer-events-none absolute inset-x-2 top-2 z-20 rounded-md border-2 border-ink bg-sun px-2 py-1.5 font-mono text-[9px] font-bold uppercase leading-tight tracking-wide text-ink opacity-0 shadow-[3px_3px_0_var(--color-ink)] transition-opacity duration-150 group-hover:opacity-100">
                    🔒 Unlock: {m.achievement}
                  </span>
                )}
                <div className="flex h-24 w-full items-end justify-center">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className={cn("max-h-24 w-auto object-contain", !isOwned && "opacity-30 grayscale")}
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className={cn("mt-1 text-xs font-extrabold leading-tight", isOwned ? "text-ink" : "text-ink/40")}>
                  {m.name}
                </span>
                <span className="font-mono text-[9px] uppercase leading-tight tracking-wide text-ink/50">
                  {m.achievement}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Earn jerseys by hitting their achievements
        </p>
      </motion.div>
    </motion.div>
  );
}
