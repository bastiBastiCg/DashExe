import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, created_at")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role: profile?.role ?? null,
      profile,
      loading,
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
