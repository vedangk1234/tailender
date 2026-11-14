// Seed the mock cricket content (entities, questions, answers) into Supabase.
// Usage: SB_TOKEN=... node scripts/seed.mjs
const REF = "zomlnwhcfjhrvvczqcuv";
const token = process.env.SB_TOKEN;

const ENTITIES = [
  ["dhoni", "MS Dhoni", ["dhoni", "ms dhoni", "mahendra singh dhoni", "mahi", "msd"]],
  ["kapil_dev", "Kapil Dev", ["kapil", "kapil dev", "kapil dev nikhanj"]],
  ["harbhajan", "Harbhajan Singh", ["harbhajan", "harbhajan singh", "bhajji"]],
  ["irfan_pathan", "Irfan Pathan", ["irfan", "irfan pathan"]],
  ["rohit_sharma", "Rohit Sharma", ["rohit", "rohit sharma", "hitman"]],
  ["gambhir", "Gautam Gambhir", ["gambhir", "gautam gambhir", "gauti"]],
  ["shreyas_iyer", "Shreyas Iyer", ["shreyas", "shreyas iyer", "iyer"]],
  ["hardik_pandya", "Hardik Pandya", ["hardik", "hardik pandya", "pandya"]],
  ["warner", "David Warner", ["warner", "david warner"]],
  ["warne", "Shane Warne", ["warne", "shane warne"]],
  ["gilchrist", "Adam Gilchrist", ["gilchrist", "adam gilchrist", "gilly"]],
  ["sachin", "Sachin Tendulkar", ["sachin", "sachin tendulkar", "tendulkar"]],
  ["sehwag", "Virender Sehwag", ["sehwag", "virender sehwag", "viru"]],
  ["gayle", "Chris Gayle", ["gayle", "chris gayle"]],
  ["guptill", "Martin Guptill", ["guptill", "martin guptill"]],
  ["fakhar_zaman", "Fakhar Zaman", ["fakhar", "fakhar zaman"]],
  ["ishan_kishan", "Ishan Kishan", ["ishan", "ishan kishan"]],
  ["shubman_gill", "Shubman Gill", ["shubman", "shubman gill", "gill"]],
  ["buttler", "Jos Buttler", ["buttler", "jos buttler"]],
  ["finch", "Aaron Finch", ["finch", "aaron finch"]],
  ["sammy", "Darren Sammy", ["sammy", "darren sammy"]],
  ["collingwood", "Paul Collingwood", ["collingwood", "paul collingwood", "colly"]],
  ["malinga", "Lasith Malinga", ["malinga", "lasith malinga"]],
  ["younis_khan", "Younis Khan", ["younis", "younis khan", "younus khan"]],
  ["kohli", "Virat Kohli", ["kohli", "virat kohli", "v kohli", "king kohli", "chiku"]],
  ["abd", "AB de Villiers", ["abd", "ab de villiers", "de villiers", "mr 360"]],
  ["bumrah", "Jasprit Bumrah", ["bumrah", "jasprit bumrah", "boom"]],
  ["ponting", "Ricky Ponting", ["ponting", "ricky ponting", "punter"]],
  ["wasim", "Wasim Akram", ["wasim", "wasim akram"]],
  ["dravid", "Rahul Dravid", ["dravid", "rahul dravid", "the wall"]],
  ["root", "Joe Root", ["root", "joe root"]],
  ["williamson", "Kane Williamson", ["williamson", "kane williamson", "kane"]],
];

const QUESTIONS = [
  { id: "q1", prompt: "Name a captain who lifted an ODI World Cup for India.", category: "International · ODI",
    answers: [["dhoni", "single"], ["kapil_dev", "six"]] },
  { id: "q2", prompt: "Name a bowler who has taken a Test hat-trick for India.", category: "International · Test",
    answers: [["harbhajan", "boundary"], ["irfan_pathan", "century"]] },
  { id: "q3", prompt: "Name a captain who has won the IPL title.", category: "IPL",
    answers: [["dhoni", "single"], ["rohit_sharma", "double"], ["gambhir", "boundary"], ["shreyas_iyer", "half_century"], ["hardik_pandya", "six"], ["warner", "six"], ["warne", "century"], ["gilchrist", "century"]] },
  { id: "q4", prompt: "Name a batter with a men's double century in ODIs.", category: "International · ODI",
    answers: [["sachin", "single"], ["rohit_sharma", "double"], ["sehwag", "boundary"], ["gayle", "half_century"], ["guptill", "six"], ["fakhar_zaman", "six"], ["ishan_kishan", "century"], ["shubman_gill", "century"]] },
  { id: "q5", prompt: "Name a captain who has won a men's T20 World Cup.", category: "International · T20",
    answers: [["dhoni", "single"], ["rohit_sharma", "single"], ["buttler", "double"], ["finch", "boundary"], ["sammy", "half_century"], ["collingwood", "six"], ["malinga", "six"], ["younis_khan", "century"]] },
];

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a) => "array[" + a.map(q).join(",") + "]::text[]";

const lines = [];
for (const [id, canon, aliases] of ENTITIES) {
  lines.push(`insert into public.entities(id,canonical,aliases) values(${q(id)},${q(canon)},${arr(aliases)}) on conflict(id) do update set canonical=excluded.canonical, aliases=excluded.aliases;`);
}
for (const qu of QUESTIONS) {
  lines.push(`insert into public.questions(id,prompt,category) values(${q(qu.id)},${q(qu.prompt)},${q(qu.category)}) on conflict(id) do update set prompt=excluded.prompt, category=excluded.category;`);
  for (const [eid, tier] of qu.answers) {
    lines.push(`insert into public.question_answers(question_id,entity_id,tier) values(${q(qu.id)},${q(eid)},${q(tier)}) on conflict(question_id,entity_id) do update set tier=excluded.tier;`);
  }
}

const sql = lines.join("\n");

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: sql }),
});
console.log("HTTP", res.status, (await res.text()).slice(0, 300));
process.exit(res.ok ? 0 : 1);
