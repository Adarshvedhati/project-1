import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { EDITORIAL_QUEUE, type EditorialQueueItem } from "../../../mocks/submissions.mock";
import type { EditorialDecision } from "../../../types";

/** FR-08 (editorial management) — the editor's submission queue + decisions. */
export async function listEditorialQueue(): Promise<EditorialQueueItem[]> {
  try {
    return await apiClient.get<EditorialQueueItem[]>(ENDPOINTS.submissions);
  } catch {
    return EDITORIAL_QUEUE;
  }
}

export async function recordDecision(submissionId: string, decision: EditorialDecision): Promise<void> {
  try {
    await apiClient.post(ENDPOINTS.editorialDecisions, { submissionId, decision });
  } catch {
    // No backend yet — decision is a no-op in this scaffold.
  }
}
