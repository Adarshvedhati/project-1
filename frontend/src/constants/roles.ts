import type { Role } from "../types";

/** Human-readable labels for each role, per SRS section 1.2. */
export const ROLE_LABELS: Record<Role, string> = {
  visitor: "Visitor",
  researcher: "Registered Researcher",
  author: "Author",
  reviewer: "Reviewer",
  editor: "Editor",
  librarian: "Librarian / Institution",
  admin: "Administrator",
};

/** Roles allowed to reach each dashboard route. */
export const DASHBOARD_ACCESS: Record<string, Role[]> = {
  "/publish/submissions": ["author", "editor", "admin"],
  "/review": ["reviewer", "editor", "admin"],
  "/editorial": ["editor", "admin"],
  "/admin": ["admin"],
  "/institutions/dashboard": ["librarian", "admin"],
};
