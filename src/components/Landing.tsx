import { Link } from "react-router-dom";
import { motion } from "motion/react";

/**
 * Tailender landing page — the public, SEO-facing home at "/".
 * Semantic, crawlable content; the game itself lives at "/play".
 */

const TIERS: { emoji: string; name: string; pts: number; note: string }[] = [
  { emoji: "🦆", name: "Duck", pts: 0, note: "No valid answer in time" },
  { emoji: "🏏", name: "Single", pts: 10, note: "The obvious one everybody types" },
  { emoji: "🏏", name: "Double", pts: 20, note: "Still pretty well-known" },
  { emoji: "🧱", name: "Boundary", pts: 40, note: "Takes a real fan to recall" },
  { emoji: "5️⃣", name: "Half Century", pts: 50, note: "Deep-cut territory" },
  { emoji: "6️⃣", name: "Six", pts: 60, note: "Only the obsessives get here" },
  { emoji: "💯", name: "Century", pts: 100, note: "The rarest valid answer alive" },
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Five questions, thirty seconds each", body: "The same five cricket questions for everyone, every day — international Tests, ODIs, T20Is and the IPL." },
  { n: "02", title: "Name the answer nobody else will", body: "Every question has many correct answers. The obvious pick scores least; the obscure-but-valid one scores a Century." },
  { n: "03", title: "First valid answer locks", body: "Type as many guesses as you like. The moment you land a valid name, it locks in at its hidden tier." },
  { n: "04", title: "Build a streak, climb the caps", body: "Come back daily for the streak. Top the daily board for the Purple Cap, the week for the Orange." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "What is Tailender?", a: "Tailender is a free daily cricket trivia game. Each day there are five questions with a 30-second timer each. Every question has many correct answers — the common one scores the least and the rarest valid answer scores a Century (100 points)." },
  { q: "When does a new puzzle come out?", a: "A fresh puzzle drops every day at midnight IST. Everyone plays the same five questions, so you can compare scores with friends." },
  { q: "Do I need an account to play?", a: "No. You can play instantly as a guest. Signing in with Google is optional and only needed to save streaks and appear on the global leaderboard." },
  { q: "How is scoring decided?", a: "Each valid answer has a pre-set obscurity tier, from Single (10) up to Century (100). The scoring is done on the server, so answer lists never reach your browser." },
  { q: "What does the typo tolerance do?", a: "Type a player's name roughly — nicknames and small spelling slips are understood. For example, 'dohni' resolves to MS Dhoni and 'bhajji' to Harbhajan Singh." },
];

export default function Landing() {
  return (
    <div className="grain relative min-h-dvh">
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        {/* ---- Hero ---- */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="brut ground-card seam rounded-3xl px-6 py-10 text-center sm:px-10 sm:py-14"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-pitch-deep">
            Daily Cricket Trivia
          </p>
          <h1 className="font-display mt-3 text-5xl leading-none tracking-tight text-ink sm:text-7xl">
            TAIL<span className="glow-ball">ENDER</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg font-semibold text-ink/80 sm:text-xl">
            The obvious answer scores least. Five questions a day, thirty seconds
            each — name the cricketer nobody else will.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              to="/play"
              className="brut brut-tap inline-flex items-center gap-2 rounded-2xl bg-cherry px-10 py-4 font-display text-xl text-paper"
            >
              🦘 Play today's puzzle
            </Link>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
              Free · No sign-up needed
            </span>
          </div>
        </motion.header>

        {/* ---- How it works ---- */}
        <section aria-labelledby="how" className="mt-14">
          <h2 id="how" className="font-display text-2xl text-ink sm:text-3xl">
            How to play
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s) => (
              <article key={s.n} className="brut-sm ground-card rounded-2xl p-5">
                <span className="font-mono text-sm font-bold text-cherry">{s.n}</span>
                <h3 className="font-display mt-1 text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-sm font-medium text-ink/75">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Scoring tiers ---- */}
        <section aria-labelledby="scoring" className="mt-14">
          <h2 id="scoring" className="font-display text-2xl text-ink sm:text-3xl">
            The scoring ladder
          </h2>
          <p className="mt-2 max-w-xl text-sm font-medium text-ink/75">
            Every valid answer carries a hidden obscurity tier. Go against the
            crowd to rack up runs — a maximum of 500 is on offer each day.
          </p>
          <ul className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl border-[3px] border-ink bg-paper shadow-[6px_6px_0_var(--color-ink)]">
            {TIERS.map((t) => (
              <li key={t.name} className="flex items-center gap-4 px-4 py-3">
                <span className="text-2xl" aria-hidden>{t.emoji}</span>
                <span className="font-display w-36 text-ink">{t.name}</span>
                <span className="font-mono text-sm font-bold text-pitch-deep">+{t.pts}</span>
                <span className="ml-auto hidden text-right text-xs font-medium text-ink/60 sm:block">
                  {t.note}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Features ---- */}
        <section aria-labelledby="features" className="mt-14">
          <h2 id="features" className="font-display text-2xl text-ink sm:text-3xl">
            Why you'll keep coming back
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🔥", title: "Daily streaks", body: "A new puzzle at midnight IST. Miss a day and the streak resets." },
              { icon: "🏆", title: "Global leaderboards", body: "Daily and weekly boards. Grab the Purple and Orange caps." },
              { icon: "🦘", title: "Collectible mascots", body: "Unlock a roster of kangaroo kits by hitting tiers and streaks." },
            ].map((f) => (
              <article key={f.title} className="brut-sm ground-card rounded-2xl p-5 text-center">
                <div className="text-3xl" aria-hidden>{f.icon}</div>
                <h3 className="font-display mt-2 text-lg text-ink">{f.title}</h3>
                <p className="mt-1 text-sm font-medium text-ink/75">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section aria-labelledby="faq" className="mt-14">
          <h2 id="faq" className="font-display text-2xl text-ink sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="brut-sm ground-card rounded-2xl p-5">
                <summary className="font-display cursor-pointer text-base text-ink">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm font-medium text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---- Closing CTA ---- */}
        <section className="mt-14 text-center">
          <Link
            to="/play"
            className="brut brut-tap inline-flex items-center gap-2 rounded-2xl bg-ink px-10 py-4 font-display text-xl text-paper"
          >
            Start playing →
          </Link>
        </section>

        <footer className="mt-14 border-t-[3px] border-ink/15 pt-6 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
            🦘 Tailender · Daily cricket trivia · Made for the obsessives
          </p>
        </footer>
      </main>
    </div>
  );
}
