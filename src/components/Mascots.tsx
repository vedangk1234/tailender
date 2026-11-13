import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import duckSrc from "@/assets/duck.lottie?url";
import { cn } from "@/lib/utils";

/** Brutalist crest: the kangaroo in a bordered, hard-shadowed badge. */
export function KangarooCrest({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "brut seam relative grid size-24 place-items-center rounded-2xl bg-sun",
        className
      )}
    >
      <span className="text-5xl">🦘</span>
    </div>
  );
}

/** The gag: a big duck walks slowly across the pitch, left → right, on a
 *  timeout (0 pts). */
export function DuckWalk({ onDone }: { onDone?: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-10 z-50 overflow-hidden">
      <motion.div
        initial={{ x: "-30vw" }}
        animate={{ x: "130vw" }}
        transition={{ duration: 6, ease: "linear" }}
        onAnimationComplete={onDone}
        className="w-max"
      >
        <div className="size-60 sm:size-72">
          <DotLottieReact src={duckSrc} autoplay loop />
        </div>
      </motion.div>
    </div>
  );
}
