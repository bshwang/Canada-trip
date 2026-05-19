"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  isFirebaseConfigured,
  signInWithGoogle as _signIn,
  signOut as _signOut,
  watchAuth,
  initAnalytics,
} from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState>({
  user: null,
  loading: true,
  configured: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    initAnalytics();
    const unsub = watchAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  async function signIn() {
    if (!configured) throw new Error("Firebase 미설정");
    await _signIn();
  }

  async function signOut() {
    if (!configured) return;
    await _signOut();
  }

  return (
    <Ctx.Provider value={{ user, loading, configured, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(Ctx);
}
