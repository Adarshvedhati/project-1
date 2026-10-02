import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "../../../types";
import { authApi } from "../api/authApi";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True while a stored session token is being verified on first load. */
  isLoading: boolean;
  hasRole: (...roles: Role[]) => boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Holds the signed-in user and role checks used throughout the app —
 * by the header (account menu), route guards, and dashboards. On first
 * load a stored token is verified against `GET /auth/me` so a page
 * refresh keeps the session.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => localStorage.getItem("auth_token") !== null);

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) return;
    let cancelled = false;
    authApi
      .me()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        // Expired/invalid token (or the dev-mode mock token): start signed out.
        localStorage.removeItem("auth_token");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((nextUser: User, token: string) => {
    localStorage.setItem("auth_token", token);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    if (localStorage.getItem("auth_token") && localStorage.getItem("auth_token") !== "mock-token") {
      authApi.logout().catch(() => undefined);
    }
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      hasRole: (...roles) => (user ? roles.some((role) => user.roles.includes(role)) : false),
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
