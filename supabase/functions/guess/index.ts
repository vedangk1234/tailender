import { cors, json } from "../_shared/cors.ts";
import { serviceClient, getUser } from "../_shared/supa.ts";
import {
  getDailySet, istDate, resolveEntity, TIER_POINTS, type Entity,
} from "../_shared/game.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { qIndex, text, ms } = await req.json();
    if (typeof qIndex !== "number" || typeof text !== "string")
      return json({ error: "bad request" }, 400);

    const c = serviceClient();
    const date = istDate();
    const { ids } = await getDailySet(c, date);
    const questionId = ids[qIndex];
    if (!questionId) return json({ error: "no such question" }, 400);

    // Already locked for this question? Don't allow re-answering.
    const { data: existing } = await c
      .from("submissions")
      .select("tier, points, display")
      .eq("user_id", user.id).eq("date", date).eq("q_index", qIndex)
      .maybeSingle();
    if (existing) {
      return json({ kind: "scored", tier: existing.tier, points: existing.points, display: existing.display, locked: true });
    }

    // Full roster for recognition (so we can say "recognised, not in list").
    const { data: entities } = await c.from("entities").select("id, canonical, aliases");
    const resolved = resolveEntity(text, (entities ?? []) as Entity[]);

    if (!resolved) return json({ kind: "unrecognised" });

    // Is the resolved entity a valid answer to THIS question?
    const { data: ans } = await c
      .from("question_answers")
      .select("tier")
      .eq("question_id", questionId).eq("entity_id", resolved.id)
      .maybeSingle();

    if (!ans) return json({ kind: "recognised_wrong", display: resolved.canonical });

    // Valid → lock it.
    const points = TIER_POINTS[ans.tier] ?? 0;
    await c.from("submissions").insert({
      user_id: user.id, date, q_index: qIndex,
      entity_id: resolved.id, display: resolved.canonical,
      tier: ans.tier, points, ms: typeof ms === "number" ? ms : null,
    });

    return json({ kind: "scored", tier: ans.tier, points, display: resolved.canonical });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
