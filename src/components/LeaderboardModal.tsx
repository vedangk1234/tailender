import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { loadLeaderboard, setNickname, type LeaderRow } from "@/lib/api";
import { mascotById } from "@/data/mascots";
import { cn } from "@/lib/utils";

export function LeaderboardModal({
  nickname,
  onNicknameSet,
  onClose,
}: {
  nickname: string | null;
  onNicknameSet: () => void;
  onClose: () => void;
}) {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let on = true;
    setLoading(true);
    loadLeaderboard(period).then((r) => {
      if (on) {
        setRows(r);
        setLoading(false);
      }
    });
    return () => {
      on = false;
    };
  }, [period]);

  async function saveName() {
    const n = name.trim();
    if (n.length < 2) {
      setNameErr("At least 2 characters");
      return;
    }
    setSaving(true);
    const res = await setNickname(n);
    setSaving(false);
    if (!res.ok) {
      setNameErr(res.error ?? "Could not save");
      return;
    }
    onNicknameSet();
    const r = await loadLeaderboard(period);
    setRows(r);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-6"
      style={{ background: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="brut ground-card my-auto w-full max-w-md rounded-3xl p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl uppercase tracking-tight text-ink">Leaderboard</h2>
          <button
            onClick={onClose}
            className="brut-sm brut-tap grid size-9 place-items-center rounded-lg bg-paper text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          {(["daily", "weekly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "brut-sm brut-tap flex-1 rounded-lg py-2 font-display text-sm uppercase tracking-wide",
                period === p ? "bg-cobalt text-paper" : "bg-paper text-ink"
              )}
            >
              {p === "daily" ? "Today" : "This week"}
            </button>
          ))}
        </div>

        {/* Nickname gate */}
        {!nickname && (
          <div className="brut-sm mb-4 rounded-xl bg-sun p-3">
            <p className="mb-2 text-center text-xs font-bold text-ink">
              Pick a nickname to appear on the board
            </p>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameErr(null);
                }}
                maxLength={16}
                placeholder="nickname"
                className="brut-sm min-w-0 flex-1 rounded-lg bg-paper px-3 py-2 text-sm font-bold text-ink outline-none"
              />
              <button
                onClick={saveName}
                disabled={saving}
                className="brut-sm brut-tap rounded-lg bg-ink px-3 py-2 font-display text-sm uppercase text-paper disabled:opacity-40"
              >
                Save
              </button>
            </div>
            {nameErr && <p className="mt-1 text-center text-[11px] font-bold text-cherry">{nameErr}</p>}
          </div>
        )}

        {/* Rows */}
        <div className="flex max-h-[55vh] flex-col gap-1.5 overflow-y-auto">
          {loading ? (
            <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-ink/40">
              Loading…
            </p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-ink/40">
              No scores yet — be the first!
            </p>
          ) : (
            rows.map((r) => {
              const me = r.nickname === nickname;
              return (
                <div
                  key={r.user_id}
                  className={cn(
                    "brut-sm flex items-center gap-3 rounded-lg px-3 py-2",
                    me ? "bg-cobalt text-paper" : "bg-paper text-ink"
                  )}
                >
                  <span className="font-display w-7 text-center tabular-nums">{r.rank}</span>
                  <img
                    src={mascotById(r.mascot).img}
                    alt=""
                    className="h-8 w-auto object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="flex-1 truncate text-sm font-extrabold">{r.nickname}</span>
                  <span className="font-mono font-bold tabular-nums">{r.total}</span>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
