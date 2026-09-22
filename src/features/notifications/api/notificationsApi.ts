import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { AlertItem } from "../types";

const MOCK_ALERTS: AlertItem[] = [
  { id: "n-1", message: "Your submission received a revision request.", createdAt: "2026-09-02", read: false },
  { id: "n-2", message: "A new issue of Journal of Applied Linguistics & Pedagogy is available.", createdAt: "2026-08-20", read: true },
];

/** FR-09 (saved searches & alerts). */
export async function listAlerts(): Promise<AlertItem[]> {
  try {
    return await apiClient.get<AlertItem[]>(ENDPOINTS.alerts);
  } catch {
    return MOCK_ALERTS;
  }
}
