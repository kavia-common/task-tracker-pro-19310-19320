"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiLogout, apiRegister, getToken, setToken, type LoginInput, type RegisterInput } from "@/lib/api";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from storage
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (input: LoginInput) => {
    setLoading(true);
    try {
      const res = await apiLogin(input);
      setToken(res.token);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setLoading(true);
    try {
      await apiRegister(input);
      // After register, redirect user to login; do not auto-login without token in spec
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, logout, register }),
    [isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Hook to access auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
