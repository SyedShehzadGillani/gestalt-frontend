import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        setAdminRole(null);
        return;
      }

      if (data) {
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        setIsAdmin(false);
        setAdminRole(null);
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
      setAdminRole(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);

          // Log login events
          if (event === "SIGNED_IN") {
            // We can't use the hook here, so we log directly
            setTimeout(async () => {
              try {
                await supabase.from("activity_logs").insert([{
                  user_id: session.user.id,
                  user_email: session.user.email || "unknown",
                  user_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Unknown",
                  action_type: "login",
                  action_description: "signed in to GESTALT HQ",
                  metadata: {},
                }]);
              } catch (err) {
                console.error("Failed to log login activity:", err);
              }
            }, 100);
          }
        } else {
          setIsAdmin(false);
          setAdminRole(null);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdminRole(session.user.id);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    // Log logout before signing out
    if (user) {
      try {
        await supabase.from("activity_logs").insert([{
          user_id: user.id,
          user_email: user.email || "unknown",
          user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
          action_type: "logout",
          action_description: "signed out of GESTALT HQ",
          metadata: {},
        }]);
      } catch (err) {
        console.error("Failed to log logout activity:", err);
      }
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        adminRole,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
