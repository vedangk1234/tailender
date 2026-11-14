import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Everyone gets a real Supabase session. Guests are anonymous users;
// signing in with Google upgrades the same account (identity linking).
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      let u = data.session?.user ?? null;
      if (!u) {
        const { data: a, error } = await supabase.auth.signInAnonymously();
        if (error) console.error("anonymous sign-in failed", error.message);
        u = a?.user ?? null;
      }
      if (mounted) {
        setUser(u);
        setReady(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isGuest = !user || user.is_anonymous === true;

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

  const signOut = () => supabase.auth.signOut();

  return { user, ready, isGuest, signInWithGoogle, signOut };
}
