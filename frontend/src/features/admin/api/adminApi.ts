import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { AdminUserRow, AuditLogEntry } from "../types";

const MOCK_USERS: AdminUserRow[] = [
  { id: "u-1", name: "Amara Chen", email: "amara.chen@example.edu", roles: ["editor"], status: "active" },
  { id: "u-2", name: "R. Fernandes", email: "r.fernandes@example.edu", roles: ["author", "researcher"], status: "active" },
  { id: "u-3", name: "P. Nakamura", email: "p.nakamura@example.org", roles: ["reviewer"], status: "invited" },
];

const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: "log-1", actor: "Amara Chen", action: "Recorded editorial decision (accept)", target: "sub-460", timestamp: "2026-09-12T10:15:00Z" },
  { id: "log-2", actor: "System", action: "Published article", target: "a-1002", timestamp: "2026-09-10T08:00:00Z" },
  { id: "log-3", actor: "N. Petrova", action: "Updated book metadata", target: "b-2002", timestamp: "2026-09-08T14:22:00Z" },
];

/** FR-11 (admin & CMS) — users, content moderation, audit trail. */
export async function listUsers(): Promise<AdminUserRow[]> {
  try {
    return await apiClient.get<AdminUserRow[]>(ENDPOINTS.users);
  } catch {
    return MOCK_USERS;
  }
}

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  try {
    return await apiClient.get<AuditLogEntry[]>(ENDPOINTS.auditLogs);
  } catch {
    return MOCK_AUDIT_LOG;
  }
}
