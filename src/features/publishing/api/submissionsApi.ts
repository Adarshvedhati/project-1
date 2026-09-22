import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { MY_SUBMISSIONS, type SubmissionSummary } from "../../../mocks/submissions.mock";
import type { SubmissionDraft } from "../types";

/** FR-06 (submission workflow). */
export async function listMySubmissions(): Promise<SubmissionSummary[]> {
  try {
    return await apiClient.get<SubmissionSummary[]>(ENDPOINTS.submissions);
  } catch {
    return MY_SUBMISSIONS;
  }
}

export async function createSubmission(draft: SubmissionDraft): Promise<{ id: string }> {
  try {
    return await apiClient.post<{ id: string }>(ENDPOINTS.submissions, draft);
  } catch {
    // No backend yet — return a mock id so the UI flow can still complete.
    return { id: `sub-${Math.floor(Math.random() * 9000 + 1000)}` };
  }
}
