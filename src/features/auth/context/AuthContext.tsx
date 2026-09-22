import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "../../../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Holds the signed-in user and role checks used throughout the app —
 * by the header (account menu), route guards, and dashboards. Backed by
 * `authApi` once the Django auth endpoints (FR-01) are live.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      hasRole: (...roles) => (user ? roles.some((role) => user.roles.includes(role)) : false),
      signIn: (nextUser, token) => {
        localStorage.setItem("auth_token", token);
        setUser(nextUser);
      },
      signOut: () => {
        localStorage.removeItem("auth_token");
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
