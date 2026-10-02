import { apiClient, isNetworkError } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { EDITORIAL_QUEUE, type EditorialQueueItem } from "../../../mocks/submissions.mock";
import type { EditorialDecision } from "../../../types";

/** FR-08 (editorial management) — the editor's submission queue + decisions. */
export async function listEditorialQueue(): Promise<EditorialQueueItem[]> {
  try {
    return await apiClient.get<EditorialQueueItem[]>(ENDPOINTS.submissions);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) return EDITORIAL_QUEUE;
    throw error;
  }
}

export async function recordDecision(submissionId: string, decision: EditorialDecision, comments = ""): Promise<void> {
  try {
    await apiClient.post(ENDPOINTS.editorialDecisions, { submissionId, decision, comments });
  } catch (error) {
    // Dev without a backend: decision is a no-op. Otherwise surface the server's message.
    if (import.meta.env.DEV && isNetworkError(error)) return;
    throw error;
  }
}
