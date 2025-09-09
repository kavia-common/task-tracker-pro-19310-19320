"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/apiClient";
import type { AuthState, AuthTokens, User } from "@/lib/types";

type AuthContextType = {
  state: AuthState;
  // PUBLIC_INTERFACE
  login: (email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  signup: (email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => void;
  // PUBLIC_INTERFACE
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "tt_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, tokens: null, loading: true });

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { user: User; tokens: AuthTokens };
        setState({ user: parsed.user, tokens: parsed.tokens, loading: false });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const persist = useCallback((user: User, tokens: AuthTokens) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tokens }));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getAccessToken = useCallback(() => state.tokens?.accessToken ?? null, [state.tokens]);

  const login = useCallback(async (email: string, password: string) => {
    const { user, tokens } = await api.login(email, password);
    setState({ user, tokens, loading: false });
    persist(user, tokens);
  }, [persist]);

  const signup = useCallback(async (email: string, password: string) => {
    const { user, tokens } = await api.signup(email, password);
    setState({ user, tokens, loading: false });
    persist(user, tokens);
  }, [persist]);

  const logout = useCallback(() => {
    setState({ user: null, tokens: null, loading: false });
    clear();
  }, [clear]);

  const value = useMemo(() => ({ state, login, signup, logout, getAccessToken }), [state, login, signup, logout, getAccessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Access the authentication context with user, tokens, and auth actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
