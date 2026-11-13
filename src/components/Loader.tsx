import { useEffect } from "react";
import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loaderSrc from "@/assets/loader.lottie?url";

/** Brief intro splash: wordmark + bat-ball Lottie + "rolling the 22 yards". */
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8"
    >
      <div className="brut ground-card flex flex-col items-center gap-4 rounded-3xl px-6 py-10">
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="font-display text-5xl uppercase tracking-tight text-ink sm:text-6xl"
        >
          Tailender
        </motion.h1>

        <div className="h-40 w-56">
          <DotLottieReact src={loaderSrc} autoplay loop />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-pitch-deep"
        >
          rolling the 22 yards
        </motion.p>
      </div>
    </motion.div>
  );
}
