# 🦘 Tailender

A daily cricket trivia game where **the obvious answer scores least**. Five
questions a day, 30 seconds each — name the answer nobody else will.

> Spec: [`docs/superpowers/specs/2026-10-30-tailender-design.md`](docs/superpowers/specs/2026-10-30-tailender-design.md)

## Status

**Vertical slice (frontend, mock data).** The full daily-play loop runs
client-side against a mock question bank. Backend (Supabase: Postgres + Google
OAuth + server-side scoring), leaderboards, streaks, and the curated 500-question
bank are not built yet — see the spec's roadmap.

### What works now
- Start screen → 5-question daily → results + emoji share card
- One answer per question, multiple guesses, **first valid answer locks**
- Guess feedback: **scored** · *"Recognised player. Not in the list."* · *"Did not recognize the player."*
- Typo + alias tolerance (Damerau-Levenshtein) — e.g. `dohni` → MS Dhoni
- Scoring tiers: 🦆 Duck (0) · Single (10) · Double (20) · Boundary (40) · Half Century (50) · Six (60) · 💯 Century (100)
- 💯 Century confetti · 🦆 duck walk-across on timeout

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Stack

- **Vite + React + TypeScript** (SPA — targets Cloudflare Pages)
- **Tailwind v4** · **Motion** (animation) · **canvas-confetti**
- Theme: *"cricket under lights"* — Anton (display) + Hanken Grotesk (body)

## Layout

```
src/
  lib/scoring.ts       tiers, points, share-card text
  lib/recognition.ts   normalize + fuzzy entity resolution (Layer 1)
  data/mockDaily.ts    mock roster + 5 tiered questions (Layer 2)
  game/useGame.ts      phases, timer, guess evaluation
  components/          StartScreen · PlayScreen · ResultsScreen · Timer · TierBadge · Mascots
```

> Mock data lives client-side for the slice. In production the answer lists,
> tiers, and scoring move **server-side** (Supabase Edge Functions) so they
> never reach the browser.
