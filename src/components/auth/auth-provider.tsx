"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAnonymous: boolean;
  signOut: () => Promise<void>;
  linkAnonymousAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // First, try to get the current session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get the current session
        const { data: { session: currentSession } } = await supabaseBrowserClient.auth.getSession();

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          // Check if the user is anonymous (no email)
          setIsAnonymous(!!currentSession.user?.is_anonymous);
        } else {
          // If no session exists, create an anonymous user
          await signInAnonymously();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Update anonymous status
        if (newSession?.user) {
          setIsAnonymous(!newSession.user.email);
        }

        setIsLoading(false);

        // Force a router refresh when auth state changes
        // This ensures all server components reflect the new auth state
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Function to sign in anonymously
  const signInAnonymously = async () => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      setIsAnonymous(!!data.user?.is_anonymous);
      return data;
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      return null;
    }
  };

  // Function to link anonymous account to a real email/password
  const linkAnonymousAccount = async (email: string, password: string) => {
    try {
      if (!isAnonymous || !user) {
        return { success: false, error: "No anonymous account to link" };
      }

      // Update the user's email and password
      const { error } = await supabaseBrowserClient.auth.updateUser({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setIsAnonymous(false);
      return { success: true };
    } catch (error: any) {
      console.error("Error linking account:", error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabaseBrowserClient.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAnonymous(false);

      // Force a router refresh after signout
      router.push('/');

      // Create a new anonymous user after signing out
      await signInAnonymously();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAnonymous,
      signOut,
      linkAnonymousAccount
    }}>
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
