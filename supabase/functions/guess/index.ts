import { cors, json } from "../_shared/cors.ts";
import { serviceClient, getUser } from "../_shared/supa.ts";
import {
  getDailySet, istDate, resolveEntity, TIER_POINTS, QUESTIONS_PER_DAY, type Entity,
} from "../_shared/game.ts";

const MAX_GUESS_LEN = 64;      // a cricketer name is never this long
const MAX_GUESSES_PER_Q = 60;  // generous for real play; blocks scripted spam

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "bad request" }, 400);
    const { qIndex, text, ms } = body as { qIndex: unknown; text: unknown; ms: unknown };

    // ---- Input validation (reject before any expensive work) ----
    if (!Number.isInteger(qIndex) || (qIndex as number) < 0 || (qIndex as number) >= QUESTIONS_PER_DAY)
      return json({ error: "bad request" }, 400);
    if (typeof text !== "string") return json({ error: "bad request" }, 400);
    const guess = text.trim();
    if (!guess) return json({ kind: "unrecognised" });
    if (guess.length > MAX_GUESS_LEN) return json({ error: "input too long" }, 400);
    const msVal = typeof ms === "number" && Number.isFinite(ms)
      ? Math.max(0, Math.min(ms, 600000)) : null;

    const c = serviceClient();
    const date = istDate();
    const { ids } = await getDailySet(c, date);
    const questionId = ids[qIndex as number];
    if (!questionId) return json({ error: "no such question" }, 400);

    // Already locked for this question? (cheap path; not rate-limited)
    const { data: existing } = await c
      .from("submissions")
      .select("tier, points, display")
      .eq("user_id", user.id).eq("date", date).eq("q_index", qIndex)
      .maybeSingle();
    if (existing) {
      return json({ kind: "scored", tier: existing.tier, points: existing.points, display: existing.display, locked: true });
    }

    // ---- Spam cap: count this attempt; bail before the expensive roster fetch ----
    const { data: attempts } = await c.rpc("bump_guess_attempt", { uid: user.id, d: date, qi: qIndex });
    if (typeof attempts === "number" && attempts > MAX_GUESSES_PER_Q)
      return json({ kind: "rate_limited" }, 429);

    // Full roster for recognition (so we can say "recognised, not in list").
    const { data: entities } = await c.from("entities").select("id, canonical, aliases");
    const resolved = resolveEntity(guess, (entities ?? []) as Entity[]);

    if (!resolved) return json({ kind: "unrecognised" });

    const { data: ans } = await c
      .from("question_answers")
      .select("tier")
      .eq("question_id", questionId).eq("entity_id", resolved.id)
      .maybeSingle();

    if (!ans) return json({ kind: "recognised_wrong", display: resolved.canonical });

    const points = TIER_POINTS[ans.tier] ?? 0;
    await c.from("submissions").insert({
      user_id: user.id, date, q_index: qIndex,
      entity_id: resolved.id, display: resolved.canonical,
      tier: ans.tier, points, ms: msVal,
    });

    return json({ kind: "scored", tier: ans.tier, points, display: resolved.canonical });
  } catch (e) {
    console.error("guess error:", e);
    return json({ error: "server error" }, 500);
  }
});
