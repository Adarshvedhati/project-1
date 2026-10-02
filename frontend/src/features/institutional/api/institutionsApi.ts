import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { InstitutionSubscription, UsagePoint } from "../types";

const MOCK_USAGE: UsagePoint[] = [
  { month: "Apr", downloads: 1120 },
  { month: "May", downloads: 1340 },
  { month: "Jun", downloads: 980 },
  { month: "Jul", downloads: 1510 },
  { month: "Aug", downloads: 1725 },
];

const MOCK_SUBSCRIPTIONS: InstitutionSubscription[] = [
  { id: "sub-j-applied-linguistics", journalTitle: "Journal of Applied Linguistics & Pedagogy", plan: "full-text", renewalDate: "2027-01-15" },
  { id: "sub-j-digital-health", journalTitle: "Digital Health Systems Review", plan: "full-text", renewalDate: "2026-12-01" },
];

/** FR-10 (institutional access & analytics). */
export async function getUsageAnalytics(): Promise<UsagePoint[]> {
  try {
    return await apiClient.get<UsagePoint[]>(ENDPOINTS.analytics);
  } catch {
    return MOCK_USAGE;
  }
}

export async function listSubscriptions(): Promise<InstitutionSubscription[]> {
  try {
    return await apiClient.get<InstitutionSubscription[]>(ENDPOINTS.subscriptions);
  } catch {
    return MOCK_SUBSCRIPTIONS;
  }
}
