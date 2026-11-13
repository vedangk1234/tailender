import { useCallback, useState } from "react";
import { DEFAULT_MASCOT_ID } from "@/data/mascots";

// Which mascot the player has equipped. Persisted locally for now; moves to the
// user's profile when Supabase is in. (Unlock-gating will also live there.)
const KEY = "tailender.mascot";

export function useMascots() {
  const [selectedId, setSelectedId] = useState<string>(
    () => localStorage.getItem(KEY) || DEFAULT_MASCOT_ID
  );

  const select = useCallback((id: string) => {
    setSelectedId(id);
    localStorage.setItem(KEY, id);
  }, []);

  return { selectedId, select };
}
