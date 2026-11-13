import { useCallback, useEffect, useState } from "react";

// Auth + streak. Google OAuth is wired through Google Identity Services (GIS);
// until a real client id + Supabase are configured it falls back to a local dev
// sign-in so the streak UX is fully testable. Everything persists to
// localStorage for now; this all moves to Supabase later.

export interface User {
  name: string;
  email: string;
  picture?: string;
}

const USER_KEY = "tailender.user";
const STREAK_KEY = "tailender.streak";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

declare global {
  interface Window {
    google?: any;
  }
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function decodeJwt(token: string): any {
  const payload = token.split(".")[1];
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [streak, setStreak] = useState<number>(() => {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? Number(raw) || 0 : 0;
  });

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }, []);

  // Initialise GIS once (if a client id is configured and the script loaded).
  useEffect(() => {
    if (!CLIENT_ID || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (resp: { credential: string }) => {
        try {
          const p = decodeJwt(resp.credential);
          persist({ name: p.name, email: p.email, picture: p.picture });
        } catch {
          /* ignore malformed token */
        }
      },
    });
  }, [persist]);

  const signInWithGoogle = useCallback(() => {
    if (CLIENT_ID && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }
    // Dev fallback: no client id yet (set VITE_GOOGLE_CLIENT_ID + Supabase later).
    persist({ name: "Dev Player", email: "dev@tailender.game" });
  }, [persist]);

  const signOut = useCallback(() => {
    window.google?.accounts?.id?.disableAutoSelect?.();
    persist(null);
  }, [persist]);

  // Mark today's play against the streak (simplistic until Supabase).
  const bumpStreak = useCallback(() => {
    setStreak((s) => {
      const next = s + 1;
      localStorage.setItem(STREAK_KEY, String(next));
      return next;
    });
  }, []);

  return { user, streak, signInWithGoogle, signOut, bumpStreak, oauthConfigured: !!CLIENT_ID };
}
