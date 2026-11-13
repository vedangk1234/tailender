# Tailender — Daily Cricket Trivia Game

**Design Spec** · 2026-10-30

---

## 1. Overview

**Tailender** is a free daily cricket trivia game in the spirit of Wordle and Unicorner: the **same 5 questions for everyone, every day**, where **correct-but-obvious answers score little and rare valid answers score big**. The name evokes the overlooked lower-order batter nobody expects — the spirit of naming the answer no one else thinks of.

Coverage is **all of cricket** — international (Tests, ODIs, T20Is) and IPL, all eras — populated from a hand-curated question bank.

## 2. Goals & Non-Goals

**Goal:** a real public product — strangers playing daily, leaderboards that matter, built to grow and to support later monetization.

**Non-goals for v1:** unlimited/practice mode, 1v1 duels, private leagues, cosmetic kits, user-submitted questions, extra badges beyond the two caps, multi-language.

## 3. Gameplay

### 3.1 Daily format
- **5 questions per day**, **30 seconds each**.
- The **same 5 questions for every player worldwide**.
- **Rollover: midnight IST** — one global clock, aligned to the India-first audience. Drives streaks and leaderboard windows.
- Each puzzle has a **puzzle number** (days since launch), shown on the results/share card.

### 3.2 Per-question loop
Within the 30s a player may **guess as many times as they want**. Each guess resolves to one of three outcomes:

| Outcome | Condition | Response |
|---|---|---|
| ✅ **Scored** | Resolves to an entity **and** it is in this question's answer list | Lock score at that tier, show **"You scored [tier] — X pts"**, question ends |
| 🟡 **Recognised, wrong** | Resolves to a real entity **but not** in this question's answer list | **"Recognised player. Not in the list."** Word auto-selected for quick re-entry; clock keeps running |
| 🔴 **Unrecognised** | Does not resolve to any entity (after fuzzy + phonetic) | **"Did not recognize the player."** Word auto-selected; clock keeps running |

- The **first valid answer locks** the score — a player cannot keep hunting for a rarer answer after landing a valid one. This creates the core tension: lock a safe **Single** now, or burn seconds chasing a **Century** and risk the duck.
- A wrong guess is never a penalty — the typed word is simply **auto-selected** so the player can backspace and retype instantly.
- **Timeout with no valid answer → Duck (0 pts)** plus the 🦆 walk-across animation.

### 3.3 Scoring tiers

| Tier | Points | Rarity | Share emoji |
|---|---|---|---|
| 🦆 Duck | 0 | no valid answer before the timer runs out | 🦆 |
| Single run | 10 | most common | 🔟 |
| Double run | 20 | rarer | 🕑 |
| Boundary | 40 | rarer | 🪢 |
| Half Century | 50 | rarer | ✋🏼 |
| THAT'S A SIX | 60 | rarer | 🏏 |
| 💯 Century | 100 | rarest — **only 1–2 answers per question** | 💯 |

- Max **100 points/question → 500/day**.
- **Authoring rule:** each question's answer list spans low→high tiers, with **at most 1–2 Century answers**.

## 4. The Answer Engine (two layers)

The engine cleanly separates *recognising what was typed* from *judging whether it's a correct answer here*.

### 4.1 Layer 1 — Recognition (global, reused everywhere)
A **master entity dictionary** of all relevant cricket entities (players, captains, teams, grounds, records). Each entity has a canonical name + curated aliases, e.g.:

```
entity: virat_kohli
  canonical: "Virat Kohli"
  aliases: ["virat kohli", "v kohli", "kohli", "king kohli", "chiku"]
```

When a player types a guess, the server resolves text → entity via:
1. **Normalize** — lowercase, strip accents/punctuation/dots, collapse spaces.
2. **Exact alias match.**
3. **Fuzzy match (Damerau-Levenshtein)** — forgives typos and transpositions ("kolhi" → "kohli").
4. **Phonetic match (Double Metaphone)** — critical for transliteration variants ("Laxman"/"Lakshman", "Ashwin"/"Ashvin").

**The dictionary must be comprehensive** — it must include players who are *not* answers to today's question. Otherwise "recognised but wrong" (🟡) cannot be distinguished from "unrecognised" (🔴). The dictionary is built once, separately from per-question answer lists.

### 4.2 Layer 2 — Validity (per question, authored)
Each question stores a bounded list of valid answers, each referencing an entity ID and assigned a tier. A resolved entity that is in the list scores its tier; otherwise it is rejected.

- Aliases live on the **entity, once**; questions reference entity IDs — alias work is bounded by how many cricketers exist, not by question count.
- Matching ambiguity (e.g. a shared surname) is handled because validity is checked against this question's small answer list.
- Whether a *related* entity counts (e.g. accepting the city "Mumbai" for a Wankhede question) is a **per-question authoring choice**.

### 4.3 Server-side scoring (anti-cheat)
Valid answers and tiers **never reach the browser**. The client sends only the typed text; the server resolves, scores, and returns just the result. This keeps the leaderboard meaningful.

## 5. Content Model

- A **curated bank of ~500 questions**, each with a bounded, enumerable valid-answer list and per-answer tiers.
- **Questions are authored last**, after the engine is built, in batches (~50–100 at a time) rather than one exhausting sitting.
- A scheduled job selects each day's 5 questions from the bank. The bank is **refilled periodically** (target ~100 days of content per batch at 5/day).
- **Scope:** all cricket — Tests, ODIs, T20Is, IPL; all eras; international + IPL; India-centric but including global stars.
- **Authoring constraints:** every question must have a *definitive, listable* answer set; tiers span low→high; ≤1–2 Century answers.

## 6. Identity & Retention

- **Play instantly as a guest** — device-based streak so casual players get the full game with zero friction.
- **Optional Google OAuth** (only sign-in method for v1) to **save the streak across devices** and **claim a leaderboard nickname**.
- **Streaks** — consecutive days played, aligned to midnight-IST rollover.
- **Leaderboards** — global **daily** and **weekly** (weekly resets Monday). Yesterday's winner pinned at the top.
- **Caps (top-of-leaderboard honors):**
  - 🟠 **Orange Cap** → **weekly** #1
  - 🟣 **Purple Cap** → **daily** #1
- Additional badges (Hat-trick, All-rounder, etc.) deferred to a later version.

## 7. Mascots & Theming

- 🦘 **Kangaroo — the brand mascot/avatar.** Appears as the leaderboard avatar; future cosmetic "kits" would be kangaroo outfits.
- 🦆 **Duck — gag only.** When a player misses completely and the timer runs out (0 pts), a duck walks across the screen. "Duck" is also the name of the 0-point tier.
- **"Third Umpire"** — the cricket framing for answer-rejection feedback (the VAR equivalent).
- No cricket-insect mascot anywhere.

## 8. Emoji Share Card

Wordle-style shareable result, structured like Farflung (title + per-question row + link):

```
Tailender #14 · 230/500
💯 🏏 🪢 🕑 🔟
https://tailender.game/s/ab12cd?e=14
```

- Title line: game name, puzzle number, score/500.
- One emoji per question, in order, mapping to the tier achieved (legend in §3.3).
- Share link reopens that specific day's result (`?e=<puzzle number>`).
- The emoji share card **ships in v1** — it is the primary growth engine.

## 9. Tech Stack

- **Frontend:** **Vite + React single-page app** → **Cloudflare Pages** (unlimited bandwidth, global edge cache, strong traffic/burst handling). A separate **static landing page** for SEO.
- **Backend:** **Supabase**
  - **Postgres** — question bank, entity dictionary, submissions, streaks, leaderboard.
  - **Google OAuth** — bundled auth.
  - **Edge Functions** — server-side recognition + scoring.
- **Daily rollover:** **Supabase pg_cron** activates each day's question set at **midnight IST**.
- **Caching:** the day's questions are identical for everyone and edge-cacheable; only submissions and leaderboard reads are dynamic.

### Rough data model
`entities` (+ `aliases`) · `questions` · `question_answers` (entity + tier + points) · `daily_sets` (which questions run on which date, with puzzle number) · `users` · `submissions` (user's result per question) · `streaks` · leaderboard view/materialized view over submissions.

### UI & Animation

- **Build skill:** the native **`frontend-design`** skill generates the distinctive, non-generic UI (kangaroo/duck branding, cricket theming, mobile-first). **Impeccable** (Paul Bakaus' design-vocabulary skill, Apache-2.0) runs as a **design-QA pass** on top — its "slop detector" flags generic AI-looking design and its steering commands polish the result.
- **Components:** **shadcn/ui + Tailwind CSS** — copy-in components we own and restyle freely (built on Radix for accessibility). Chosen for full branding control over an opinionated house style; pure static output suits Cloudflare Pages.
- **Animation stack:**
  - **Motion** (ex-Framer Motion) — UI transitions, tier reveals, timer, screen changes.
  - **canvas-confetti** — celebratory bursts on 💯 Century and daily wins.
  - **Lottie** (`lottie-react`) — mascot animations: 🦘 kangaroo celebrations and the 🦆 duck walk-across on timeout. (**Rive** is a later upgrade for interactive, stateful mascots.)

## 10. Out of Scope for v1 (future)

- **Unlimited / "Infinity" practice mode** — random-draw from the bank; a likely **paid monetization lever** (Unicorner charges for exactly this).
- **1v1 duels** and **private leagues.**
- **Cosmetic kangaroo kits** (unlocked by games played / streaks / Centuries; a rare "winner-only" kit).
- **User-submitted questions** (great content pipeline, needs moderation).
- **Additional weekly badges/trophies.**
- **Multi-language** support.

## 11. Open Items

- **Domain:** confirm availability for `tailender.game` / `.lol` / `.io`.
- **Monetization:** confirmed future direction is a paid Unlimited mode; not in v1.
