import { cors, json } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/supa.ts";
import { getDailySet, istDate } from "../_shared/game.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const c = serviceClient();
    const date = istDate();
    const { puzzle, ids } = await getDailySet(c, date);

    const { data: qs } = await c
      .from("questions")
      .select("id, prompt, category")
      .in("id", ids);

    // Preserve the daily order and strip anything that could leak answers.
    const byId = new Map((qs ?? []).map((q) => [q.id, q]));
    const questions = ids
      .map((id, index) => {
        const q = byId.get(id);
        return q ? { index, prompt: q.prompt, category: q.category } : null;
      })
      .filter(Boolean);

    return json({ date, puzzleNumber: puzzle, questions });
  } catch (e) {
    console.error("daily error:", e);
    return json({ error: "server error" }, 500);
  }
});
