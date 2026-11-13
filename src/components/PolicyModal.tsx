import { motion } from "motion/react";
import { X } from "lucide-react";

export type PolicyKind = "privacy" | "terms";

const CONTENT: Record<PolicyKind, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "DRAFT — review before public launch.",
      "Tailender is a daily cricket trivia game. We keep data collection to the minimum needed to run the game.",
      "What we store: if you sign in with Google we store your name, email and profile picture to show you on leaderboards and to save your streak and progress. If you play as a guest, your streak and settings are stored only in your browser (localStorage).",
      "What we don't do: we don't sell your data, and we don't use it for advertising.",
      "Cookies / local storage: used to remember your settings, streak, equipped mascot and whether you've played today.",
      "Contact: email hello@tailender.game for any privacy request, including deletion of your account data.",
    ],
  },
  terms: {
    title: "Terms of Use",
    body: [
      "DRAFT — review before public launch.",
      "By playing Tailender you agree to these terms. The game is provided as-is for entertainment.",
      "Fair play: don't attempt to cheat, script, or manipulate scores or leaderboards.",
      "Content: team names used in cosmetic jerseys are playful parodies and are not affiliated with, endorsed by, or sponsored by any real team, league, or board.",
      "Accounts: you're responsible for activity under your account. We may remove accounts that abuse the service.",
      "Changes: we may update the game and these terms over time.",
      "Contact: hello@tailender.game.",
    ],
  },
};

export function PolicyModal({ kind, onClose }: { kind: PolicyKind; onClose: () => void }) {
  const { title, body } = CONTENT[kind];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-4 py-6"
      style={{ background: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut ground-card my-auto w-full max-w-lg rounded-3xl p-6"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-tight text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="brut-sm brut-tap grid size-9 place-items-center rounded-lg bg-paper text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink/80">
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? "font-mono text-xs font-bold uppercase tracking-widest text-cherry" : ""}>
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
