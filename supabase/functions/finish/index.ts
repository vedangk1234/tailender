import { cors, json } from "../_shared/cors.ts";
import { serviceClient, getUser } from "../_shared/supa.ts";
import {
  getDailySet, istDate, leagueFor, computeUnlocks, ALL_MASCOTS, TIER_POINTS,
} from "../_shared/game.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const body = await req.json().catch(() => ({}));
    const timeMs = typeof body.timeMs === "number" ? body.timeMs : 0;

    const c = serviceClient();
    const date = istDate();
    const { ids } = await getDailySet(c, date);

    // Build the scorecard items from locked submissions (missing = duck).
    const { data: subs } = await c
      .from("submissions")
      .select("q_index, tier, display, points")
      .eq("user_id", user.id).eq("date", date);
    const byIdx = new Map((subs ?? []).map((s) => [s.q_index, s]));

    const { data: qs } = await c.from("questions").select("id, prompt").in("id", ids);
    const promptById = new Map((qs ?? []).map((q) => [q.id, q.prompt]));

    const items = ids.map((qid, i) => {
      const s = byIdx.get(i);
      return {
        prompt: promptById.get(qid) ?? "",
        tier: s?.tier ?? "duck",
        display: s?.display ?? null,
      };
    });
    const tiers = items.map((it) => it.tier);
    const total = tiers.reduce((sum, t) => sum + (TIER_POINTS[t] ?? 0), 0);

    // Idempotent: if already finalized today, just return it.
    const { data: existing } = await c
      .from("scorecards").select("total, items")
      .eq("user_id", user.id).eq("date", date).maybeSingle();

    // Current streak state
    const { data: st } = await c.from("user_state").select("*").eq("user_id", user.id).maybeSingle();
    let streak = st?.current_streak ?? 0;

    if (!existing) {
      // ---- streak ----
      const yesterday = istDate(new Date(Date.now() - 86400000));
      if (st?.last_played_date === date) {
        streak = st.current_streak;
      } else if (st?.last_played_date === yesterday) {
        streak = (st?.current_streak ?? 0) + 1;
      } else {
        streak = 1;
      }
      const best = Math.max(st?.best_streak ?? 0, streak);
      await c.from("user_state").upsert({
        user_id: user.id, current_streak: streak, best_streak: best,
        last_played_date: date, updated_at: new Date().toISOString(),
      });

      // ---- scorecard ---- (abort before touching stats if this fails)
      const { error: scErr } = await c
        .from("scorecards")
        .insert({ user_id: user.id, date, total, time_ms: timeMs, items });
      if (scErr) return json({ error: "scorecard insert failed: " + scErr.message }, 500);

      // ---- daily stats ----
      const { data: ds } = await c.from("daily_stats").select("*").eq("date", date).maybeSingle();
      await c.from("daily_stats").upsert({
        date,
        plays_count: (ds?.plays_count ?? 0) + 1,
        top_score: Math.max(ds?.top_score ?? 0, total),
      });
    }

    // ---- mascot unlocks (always re-evaluate; cheap, idempotent) ----
    const { data: owned } = await c.from("mascots_unlocked").select("mascot_id").eq("user_id", user.id);
    const ownedSet = new Set((owned ?? []).map((m) => m.mascot_id));
    const target = new Set(computeUnlocks(tiers, total, streak));
    // Gold = collect all other 19
    const others = ALL_MASCOTS.filter((m) => m !== "gold");
    const unionOwnedTarget = new Set([...ownedSet, ...target]);
    if (others.every((m) => unionOwnedTarget.has(m))) target.add("gold");

    const newOnes = [...target].filter((m) => !ownedSet.has(m));
    if (newOnes.length) {
      await c.from("mascots_unlocked").insert(newOnes.map((m) => ({ user_id: user.id, mascot_id: m })));
    }

    const league = leagueFor(total);
    return json({
      total, items, streak,
      league: { id: league.id, name: league.name },
      newUnlocks: newOnes,
      alreadyPlayed: !!existing,
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
