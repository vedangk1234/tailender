import fs from "node:fs";
const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split("\n").filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const URL = env.VITE_SUPABASE_URL, ANON = env.VITE_SUPABASE_ANON_KEY;

// 1) anonymous sign-in
let r = await fetch(`${URL}/auth/v1/signup`, {
  method: "POST",
  headers: { apikey: ANON, "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
const session = await r.json();
const jwt = session.access_token;
const uid = session.user?.id;
console.log("anon user:", uid?.slice(0, 8), "is_anonymous:", session.user?.is_anonymous);

const authH = { apikey: ANON, Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" };
const fn = async (name, body) => {
  const res = await fetch(`${URL}/functions/v1/${name}`, {
    method: "POST", headers: authH, body: JSON.stringify(body ?? {}),
  });
  return res.json();
};
const rest = async (path) => {
  const res = await fetch(`${URL}/rest/v1/${path}`, { headers: authH });
  return res.json();
};

console.log("daily:", JSON.stringify(await fn("daily")).slice(0, 240));
console.log("guess q0 'dohni':", JSON.stringify(await fn("guess", { qIndex: 0, text: "dohni", ms: 2500 })));
console.log("guess q0 'kohli' (locked):", JSON.stringify(await fn("guess", { qIndex: 0, text: "kohli" })));
console.log("guess q1 'irfan pathan':", JSON.stringify(await fn("guess", { qIndex: 1, text: "irfan pathan", ms: 4000 })));
console.log("finish:", JSON.stringify(await fn("finish", { timeMs: 15000 })));
console.log("scorecard:", JSON.stringify(await rest(`scorecards?select=date,total`)));
console.log("daily_stats:", JSON.stringify(await rest(`daily_stats?select=*`)));
console.log("mascots:", JSON.stringify((await rest(`mascots_unlocked?select=mascot_id`)).map((m) => m.mascot_id)));
