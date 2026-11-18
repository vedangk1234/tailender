# 🦘 Tailender

A daily cricket trivia game where **the obvious answer scores least**. Five
questions a day, 30 seconds each — name the answer nobody else will.

> Spec: [`docs/superpowers/specs/2026-10-30-tailender-design.md`](docs/superpowers/specs/2026-10-30-tailender-design.md)

## Status

**Full stack, pre-deploy.** The game runs end-to-end against a Supabase backend
(Postgres + server-side scoring via Edge Functions), with a public SEO landing
page at `/` and the game at `/play`.

### What works now
- **Landing page (`/`)** — SEO-optimised, semantic, with meta/OG/JSON-LD + sitemap
- **Game (`/play`)** — Start → 5-question daily → results + emoji share card
- One answer per question, multiple guesses, **first valid answer locks**
- Guess feedback: **scored** · *"Recognised player. Not in the list."* · *"Did not recognize the player."*
- Typo + alias tolerance (Damerau-Levenshtein) — e.g. `dohni` → MS Dhoni
- Scoring tiers: 🦆 Duck (0) · Single (10) · Double (20) · Boundary (40) · Half Century (50) · Six (60) · 💯 Century (100)
- 💯 Century confetti · 🦆 duck walk-across on timeout
- **Server-side scoring** — answer lists live in Postgres with RLS and never reach the browser
- **Daily rotation** — `daily_sets` built by pg_cron at midnight IST (self-generates on first visit if cron is off)
- Streaks, daily + weekly leaderboards, 20 unlockable kangaroo mascots, guest play + optional Google sign-in

### Not done yet
- Deploy to Cloudflare Pages (`public/_redirects` is ready)
- Grow the question bank toward the ~500 target (currently 12 curated questions)
- Confirm Google OAuth credentials in Supabase

## Run it

```bash
npm install
npm run dev               # http://localhost:5173
npm run build             # type-check + production build
npm run validate:content  # offline check of the question bank + daily rotation
```

## Backend (Supabase)

```
supabase/
  migrations/
    0001_init.sql            tables, RLS, leaderboard views, auth trigger
    0002_bigint_time.sql     timing column widening
    0003_daily_rollover.sql  build_daily_set / roll_daily + pg_cron schedule
  functions/
    daily/    serve today's 5 questions (no answers leak)
    guess/    server-side scoring of a guess
    finish/   scorecard + streak + mascot unlocks
    equip/    set the player's mascot
    _shared/  recognition, tiers, leagues, daily-set resolution
scripts/
  content.mjs           entities + questions (single source of truth)
  seed.mjs              SB_TOKEN=... npm run seed   → writes content to the DB
  validateContent.mjs   npm run validate:content
  applySql.mjs / testBackend.mjs
```

> Apply migrations with the Supabase CLI (`supabase db push`) or the dashboard
> SQL editor, then seed the content with `SB_TOKEN=... npm run seed`.

## Frontend

- **Vite + React + TypeScript** (SPA → Cloudflare Pages) · `react-router-dom`
- **Tailwind v4** · **Motion** · **Lottie** (`@lottiefiles/dotlottie-react`)
- Theme: neo-brutalist *"cricket"* — Archivo Black + Hanken Grotesk + Space Mono

```
src/
  App.tsx              router: "/" → Landing, "/play" → Game
  Game.tsx             the daily-play phase machine
  components/Landing.tsx   public SEO landing page
  lib/scoring.ts       tiers, points, share-card text
  lib/recognition.ts   normalize + fuzzy entity resolution (Layer 1, client mirror)
  lib/api.ts           Edge Function calls + RLS-protected reads
  game/useGame.ts      phases, timer, guess evaluation
```
