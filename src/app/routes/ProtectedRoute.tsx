import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import type { Role } from "../../types";

interface ProtectedRouteProps {
  roles?: Role[];
  children: ReactNode;
}

/**
 * Gates a dashboard route behind sign-in and, optionally, a role check
 * (SRS section 1.2 roles + section 9 access control). Unauthenticated
 * users are sent to sign in; signed-in users without the right role are
 * sent home.
 */
export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  if (roles && roles.length > 0 && !hasRole(...roles)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
