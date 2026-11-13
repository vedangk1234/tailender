// MOCK daily content for the vertical slice. These are illustrative questions
// with hand-tiered answers — the real curated bank is authored later, and in
// production this data + scoring lives server-side (never shipped to the client).

import type { Entity } from "@/lib/recognition";
import type { TierId } from "@/lib/scoring";

export interface Answer {
  entityId: string;
  tier: TierId;
}

export interface Question {
  id: string;
  prompt: string;
  category: string;
  answers: Answer[];
}

// --- Layer 1: the global entity dictionary (players etc. we can recognise) ---
export const ROSTER: Entity[] = [
  { id: "dhoni", canonical: "MS Dhoni", aliases: ["dhoni", "ms dhoni", "mahendra singh dhoni", "mahi", "msd"] },
  { id: "kapil_dev", canonical: "Kapil Dev", aliases: ["kapil", "kapil dev", "kapil dev nikhanj"] },
  { id: "harbhajan", canonical: "Harbhajan Singh", aliases: ["harbhajan", "harbhajan singh", "bhajji"] },
  { id: "irfan_pathan", canonical: "Irfan Pathan", aliases: ["irfan", "irfan pathan"] },
  { id: "rohit_sharma", canonical: "Rohit Sharma", aliases: ["rohit", "rohit sharma", "hitman"] },
  { id: "gambhir", canonical: "Gautam Gambhir", aliases: ["gambhir", "gautam gambhir", "gauti"] },
  { id: "shreyas_iyer", canonical: "Shreyas Iyer", aliases: ["shreyas", "shreyas iyer", "iyer"] },
  { id: "hardik_pandya", canonical: "Hardik Pandya", aliases: ["hardik", "hardik pandya", "pandya"] },
  { id: "warner", canonical: "David Warner", aliases: ["warner", "david warner"] },
  { id: "warne", canonical: "Shane Warne", aliases: ["warne", "shane warne"] },
  { id: "gilchrist", canonical: "Adam Gilchrist", aliases: ["gilchrist", "adam gilchrist", "gilly"] },
  { id: "sachin", canonical: "Sachin Tendulkar", aliases: ["sachin", "sachin tendulkar", "tendulkar"] },
  { id: "sehwag", canonical: "Virender Sehwag", aliases: ["sehwag", "virender sehwag", "viru"] },
  { id: "gayle", canonical: "Chris Gayle", aliases: ["gayle", "chris gayle"] },
  { id: "guptill", canonical: "Martin Guptill", aliases: ["guptill", "martin guptill"] },
  { id: "fakhar_zaman", canonical: "Fakhar Zaman", aliases: ["fakhar", "fakhar zaman"] },
  { id: "ishan_kishan", canonical: "Ishan Kishan", aliases: ["ishan", "ishan kishan"] },
  { id: "shubman_gill", canonical: "Shubman Gill", aliases: ["shubman", "shubman gill", "gill"] },
  { id: "buttler", canonical: "Jos Buttler", aliases: ["buttler", "jos buttler"] },
  { id: "finch", canonical: "Aaron Finch", aliases: ["finch", "aaron finch"] },
  { id: "sammy", canonical: "Darren Sammy", aliases: ["sammy", "darren sammy"] },
  { id: "collingwood", canonical: "Paul Collingwood", aliases: ["collingwood", "paul collingwood", "colly"] },
  { id: "malinga", canonical: "Lasith Malinga", aliases: ["malinga", "lasith malinga"] },
  { id: "younis_khan", canonical: "Younis Khan", aliases: ["younis", "younis khan", "younus khan"] },
  // --- Decoys: recognised players who are NOT answers to today's questions ---
  { id: "kohli", canonical: "Virat Kohli", aliases: ["kohli", "virat kohli", "v kohli", "king kohli", "chiku"] },
  { id: "abd", canonical: "AB de Villiers", aliases: ["abd", "ab de villiers", "de villiers", "mr 360"] },
  { id: "bumrah", canonical: "Jasprit Bumrah", aliases: ["bumrah", "jasprit bumrah", "boom"] },
  { id: "ponting", canonical: "Ricky Ponting", aliases: ["ponting", "ricky ponting", "punter"] },
  { id: "wasim", canonical: "Wasim Akram", aliases: ["wasim", "wasim akram"] },
  { id: "dravid", canonical: "Rahul Dravid", aliases: ["dravid", "rahul dravid", "the wall"] },
  { id: "root", canonical: "Joe Root", aliases: ["root", "joe root"] },
  { id: "williamson", canonical: "Kane Williamson", aliases: ["williamson", "kane williamson", "kane"] },
];

// --- Layer 2: the five daily questions with per-answer tiers ---
export const DAILY_QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Name a captain who lifted an ODI World Cup for India.",
    category: "International · ODI",
    answers: [
      { entityId: "dhoni", tier: "single" },
      { entityId: "kapil_dev", tier: "six" },
    ],
  },
  {
    id: "q2",
    prompt: "Name a bowler who has taken a Test hat-trick for India.",
    category: "International · Test",
    answers: [
      { entityId: "harbhajan", tier: "boundary" },
      { entityId: "irfan_pathan", tier: "century" },
    ],
  },
  {
    id: "q3",
    prompt: "Name a captain who has won the IPL title.",
    category: "IPL",
    answers: [
      { entityId: "dhoni", tier: "single" },
      { entityId: "rohit_sharma", tier: "double" },
      { entityId: "gambhir", tier: "boundary" },
      { entityId: "shreyas_iyer", tier: "half_century" },
      { entityId: "hardik_pandya", tier: "six" },
      { entityId: "warner", tier: "six" },
      { entityId: "warne", tier: "century" },
      { entityId: "gilchrist", tier: "century" },
    ],
  },
  {
    id: "q4",
    prompt: "Name a batter with a men's double century in ODIs.",
    category: "International · ODI",
    answers: [
      { entityId: "sachin", tier: "single" },
      { entityId: "rohit_sharma", tier: "double" },
      { entityId: "sehwag", tier: "boundary" },
      { entityId: "gayle", tier: "half_century" },
      { entityId: "guptill", tier: "six" },
      { entityId: "fakhar_zaman", tier: "six" },
      { entityId: "ishan_kishan", tier: "century" },
      { entityId: "shubman_gill", tier: "century" },
    ],
  },
  {
    id: "q5",
    prompt: "Name a captain who has won a men's T20 World Cup.",
    category: "International · T20",
    answers: [
      { entityId: "dhoni", tier: "single" },
      { entityId: "rohit_sharma", tier: "single" },
      { entityId: "buttler", tier: "double" },
      { entityId: "finch", tier: "boundary" },
      { entityId: "sammy", tier: "half_century" },
      { entityId: "collingwood", tier: "six" },
      { entityId: "malinga", tier: "six" },
      { entityId: "younis_khan", tier: "century" },
    ],
  },
];

export const PUZZLE_NUMBER = 1;
