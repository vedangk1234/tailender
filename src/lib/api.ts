import { supabase } from "./supabase";
import { istDateKey } from "./time";

async function invoke<T>(name: string, body?: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body: body ?? {} });
  if (error) throw error;
  return data as T;
}

export interface DailyQuestion { index: number; prompt: string; category: string }
export interface DailyResponse { date: string; puzzleNumber: number; questions: DailyQuestion[] }

export type GuessResult =
  | { kind: "scored"; tier: string; points: number; display: string; locked?: boolean }
  | { kind: "recognised_wrong"; display: string }
  | { kind: "unrecognised" };

export interface AnswerKeyEntry { display: string; tier: string }
export interface ScoreItem {
  prompt: string;
  tier: string;
  display: string | null;
  /** Full valid-answer list for this question (revealed after the game). */
  answers?: AnswerKeyEntry[];
}
export interface FinishResponse {
  total: number;
  items: ScoreItem[];
  streak: number;
  league: { id: string; name: string };
  newUnlocks: string[];
  alreadyPlayed: boolean;
}

export const api = {
  daily: () => invoke<DailyResponse>("daily"),
  guess: (qIndex: number, text: string, ms?: number) =>
    invoke<GuessResult>("guess", { qIndex, text, ms }),
  finish: (timeMs?: number) => invoke<FinishResponse>("finish", { timeMs }),
  equip: (mascotId: string) => invoke<{ equipped: string }>("equip", { mascotId }),
};

// ---- Direct reads (RLS-protected) ----
export interface HomeData {
  playsToday: number;
  topToday: number;
  scorecard: { total: number; items: ScoreItem[] } | null;
  equippedMascot: string;
  streak: number;
  unlocked: string[];
  nickname: string | null;
}

export async function loadHome(userId: string): Promise<HomeData> {
  const today = istDateKey();
  const [stats, sc, state, mascots, profile] = await Promise.all([
    supabase.from("daily_stats").select("plays_count, top_score").eq("date", today).maybeSingle(),
    supabase.from("scorecards").select("total, items").eq("user_id", userId).eq("date", today).maybeSingle(),
    supabase.from("user_state").select("equipped_mascot, current_streak").eq("user_id", userId).maybeSingle(),
    supabase.from("mascots_unlocked").select("mascot_id").eq("user_id", userId),
    supabase.from("profiles").select("nickname").eq("id", userId).maybeSingle(),
  ]);
  return {
    playsToday: stats.data?.plays_count ?? 0,
    topToday: stats.data?.top_score ?? 0,
    scorecard: sc.data ? { total: sc.data.total, items: sc.data.items } : null,
    equippedMascot: state.data?.equipped_mascot ?? "default",
    streak: state.data?.current_streak ?? 0,
    unlocked: (mascots.data ?? []).map((m) => m.mascot_id),
    nickname: profile.data?.nickname ?? null,
  };
}

export interface LeaderRow {
  user_id: string;
  nickname: string;
  mascot: string;
  total: number;
  rank: number;
}

export async function loadLeaderboard(period: "daily" | "weekly"): Promise<LeaderRow[]> {
  if (period === "daily") {
    const { data } = await supabase
      .from("leaderboard_daily").select("user_id, nickname, mascot, total, rank")
      .eq("date", istDateKey()).order("rank").limit(50);
    return (data ?? []) as LeaderRow[];
  }
  // weekly: Monday-start of the current IST date
  const d = new Date(istDateKey() + "T00:00:00Z");
  const dow = (d.getUTCDay() + 6) % 7; // 0 = Monday
  d.setUTCDate(d.getUTCDate() - dow);
  const weekStart = d.toISOString().slice(0, 10);
  const { data } = await supabase
    .from("leaderboard_weekly").select("user_id, nickname, mascot, total, rank")
    .eq("week_start", weekStart).order("rank").limit(50);
  return (data ?? []) as LeaderRow[];
}

export async function setNickname(nickname: string): Promise<{ ok: boolean; error?: string }> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, error: "not signed in" };
  const { error } = await supabase.from("profiles").update({ nickname }).eq("id", u.user.id);
  if (error) return { ok: false, error: error.message.includes("duplicate") ? "That name is taken" : error.message };
  return { ok: true };
}
