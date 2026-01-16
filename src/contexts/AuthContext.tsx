import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Extended role types to match the database
export type UserRole = "super_admin" | "admin" | "manager" | "receptionist" | "dentist" | "content_editor";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  // Role checks
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isDentist: boolean;
  isReceptionist: boolean;
  isContentEditor: boolean;
  // Permission helpers
  canAccessCMS: boolean;
  canAccessSettings: boolean;
  canAccessReports: boolean;
  canManageUsers: boolean;
  canManagePatients: boolean;
  canManageBilling: boolean;
  canManageInventory: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch profile", error);
        return null;
      }

      return data as Profile | null;
    } catch (err) {
      console.error("Profile fetch exception", err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    // IMPORTANT: keep this callback synchronous (no awaits / no other supabase calls)
    // to avoid auth deadlocks.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    // Then fetch the initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!isMounted) return;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      })
      .catch((err) => {
        console.error("Failed to get session", err);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile whenever user changes (separate from auth callback to avoid deadlocks)
  useEffect(() => {
    let active = true;

    if (!user?.id) {
      setProfile(null);
      return;
    }

    (async () => {
      const profileData = await fetchProfile(user.id);
      if (active) setProfile(profileData);
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Role is NOT passed to prevent privilege escalation.
    // The database trigger always defaults new users to 'receptionist'.
    // Admins can change roles via User Management after account creation.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // Role checks
  const role = profile?.role;
  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin" || isSuperAdmin;
  const isManager = role === "manager";
  const isDentist = role === "dentist";
  const isReceptionist = role === "receptionist";
  const isContentEditor = role === "content_editor";

  // Permission checks
  const canAccessCMS = isSuperAdmin || isAdmin || isContentEditor;
  const canAccessSettings = isSuperAdmin || isAdmin;
  const canAccessReports = isSuperAdmin || isAdmin || isManager;
  const canManageUsers = isSuperAdmin || isAdmin;
  const canManagePatients = isSuperAdmin || isAdmin || isManager || isReceptionist || isDentist;
  const canManageBilling = isSuperAdmin || isAdmin || isManager || isReceptionist;
  const canManageInventory = isSuperAdmin || isAdmin || isManager;

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    // Role checks
    isAdmin,
    isSuperAdmin,
    isManager,
    isDentist,
    isReceptionist,
    isContentEditor,
    // Permission helpers
    canAccessCMS,
    canAccessSettings,
    canAccessReports,
    canManageUsers,
    canManagePatients,
    canManageBilling,
    canManageInventory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
