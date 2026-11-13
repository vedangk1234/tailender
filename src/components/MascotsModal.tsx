import { motion } from "motion/react";
import { X, Check } from "lucide-react";
import { MASCOTS } from "@/data/mascots";
import { cn } from "@/lib/utils";

/** The collection: browse all 20 jerseys and equip one. */
export function MascotsModal({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
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
              Collect all 20 · tap to equip
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
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className={cn(
                  "brut-sm brut-tap relative flex flex-col items-center gap-1 rounded-2xl bg-paper p-3 text-center",
                  equipped && "ring-4 ring-pitch"
                )}
              >
                {equipped && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded border-2 border-ink bg-pitch px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-paper">
                    <Check size={10} /> On
                  </span>
                )}
                <div className="flex h-24 w-full items-end justify-center">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    className="max-h-24 w-auto object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span className="mt-1 text-xs font-extrabold leading-tight text-ink">
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
          Preview mode · unlocks activate with your account
        </p>
      </motion.div>
    </motion.div>
  );
}
