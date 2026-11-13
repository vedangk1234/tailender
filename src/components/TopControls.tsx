import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Menu } from "lucide-react";
import { isSoundOn, setSound } from "@/lib/sound";
import { AboutModal } from "./AboutModal";
import { PolicyModal, type PolicyKind } from "./PolicyModal";

/** Fixed top-right controls: sound toggle + about/links menu. */
export function TopControls() {
  const [soundOn, setSoundOn] = useState(isSoundOn());
  const [showAbout, setShowAbout] = useState(false);
  const [policy, setPolicy] = useState<PolicyKind | null>(null);

  function toggleSound() {
    const next = !soundOn;
    setSound(next);
    setSoundOn(next);
  }

  return (
    <>
      <div className="fixed right-3 top-3 z-40 flex gap-2">
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          className="brut-sm brut-tap grid size-10 place-items-center rounded-lg bg-paper text-ink"
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          onClick={() => setShowAbout(true)}
          aria-label="Menu"
          className="brut-sm brut-tap grid size-10 place-items-center rounded-lg bg-paper text-ink"
        >
          <Menu size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showAbout && (
          <AboutModal
            key="about"
            onClose={() => setShowAbout(false)}
            onOpenPolicy={(k) => setPolicy(k)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {policy && <PolicyModal key="policy" kind={policy} onClose={() => setPolicy(null)} />}
      </AnimatePresence>
    </>
  );
}
