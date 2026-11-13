import { motion } from "motion/react";
import { X, Coffee, Flag, Shield, FileText } from "lucide-react";
import type { PolicyKind } from "./PolicyModal";

// Placeholder handles/links — swap for the real ones at launch.
const SOCIALS = [
  { label: "TikTok", href: "https://www.tiktok.com/@tailendergame", emoji: "🎵" },
  { label: "Instagram", href: "https://instagram.com/tailendergame", emoji: "📸" },
  { label: "Reddit", href: "https://reddit.com/r/tailender", emoji: "👽" },
  { label: "X / Twitter", href: "https://x.com/tailendergame", emoji: "𝕏" },
];

const REPORT_MAILTO =
  "mailto:hello@tailender.game?subject=Tailender%20problem%20report&body=What%20happened%3A%0A%0AToday%27s%20puzzle%20%231";

export function AboutModal({
  onClose,
  onOpenPolicy,
}: {
  onClose: () => void;
  onOpenPolicy: (kind: PolicyKind) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-center justify-center overflow-y-auto px-4 py-6"
      style={{ background: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut ground-card my-auto w-full max-w-sm rounded-3xl p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink">Tailender</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
              Daily cricket trivia
            </p>
          </div>
          <button
            onClick={onClose}
            className="brut-sm brut-tap grid size-9 place-items-center rounded-lg bg-paper text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Socials */}
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50">
          Follow
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="brut-sm brut-tap flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-sm font-bold text-ink"
            >
              <span>{s.emoji}</span> {s.label}
            </a>
          ))}
        </div>

        {/* Support + report */}
        <div className="mt-3 flex flex-col gap-2">
          <a
            href="https://buymeacoffee.com/tailender"
            target="_blank"
            rel="noopener noreferrer"
            className="brut-sm brut-tap flex items-center justify-center gap-2 rounded-lg bg-sun px-3 py-2.5 font-display text-sm uppercase tracking-wide text-ink"
          >
            <Coffee size={16} /> Buy me a coffee
          </a>
          <a
            href={REPORT_MAILTO}
            className="brut-sm brut-tap flex items-center justify-center gap-2 rounded-lg bg-paper px-3 py-2.5 text-sm font-bold text-ink"
          >
            <Flag size={16} /> Report a problem
          </a>
        </div>

        {/* Legal */}
        <div className="mt-4 flex justify-center gap-4 text-xs font-bold text-ink/60">
          <button onClick={() => onOpenPolicy("privacy")} className="flex items-center gap-1 hover:text-ink">
            <Shield size={13} /> Privacy
          </button>
          <button onClick={() => onOpenPolicy("terms")} className="flex items-center gap-1 hover:text-ink">
            <FileText size={13} /> Terms
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
