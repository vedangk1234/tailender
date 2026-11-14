import { cors, json } from "../_shared/cors.ts";
import { serviceClient, getUser } from "../_shared/supa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const user = await getUser(req);
    if (!user) return json({ error: "unauthorized" }, 401);
    const { mascotId } = await req.json();
    if (typeof mascotId !== "string") return json({ error: "bad request" }, 400);

    const c = serviceClient();
    // Must be unlocked.
    const { data: owned } = await c
      .from("mascots_unlocked").select("mascot_id")
      .eq("user_id", user.id).eq("mascot_id", mascotId).maybeSingle();
    if (!owned) return json({ error: "not unlocked" }, 403);

    await c.from("user_state").upsert({
      user_id: user.id, equipped_mascot: mascotId, updated_at: new Date().toISOString(),
    });
    return json({ equipped: mascotId });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
