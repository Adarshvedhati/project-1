import type { Role } from "../../types";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  status: "active" | "invited" | "suspended";
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}
