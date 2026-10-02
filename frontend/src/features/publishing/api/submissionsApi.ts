import { apiClient, isNetworkError } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { MY_SUBMISSIONS, type SubmissionSummary } from "../../../mocks/submissions.mock";
import type { SubmissionDraft } from "../types";

/** FR-06 (submission workflow). */
export async function listMySubmissions(): Promise<SubmissionSummary[]> {
  try {
    return await apiClient.get<SubmissionSummary[]>(`${ENDPOINTS.submissions}?scope=mine`);
  } catch {
    return MY_SUBMISSIONS;
  }
}

export async function createSubmission(draft: SubmissionDraft): Promise<{ id: string }> {
  try {
    return await apiClient.post<{ id: string }>(ENDPOINTS.submissions, draft);
  } catch (error) {
    // Real API errors (validation, auth) must reach the form. Only fall back to a
    // mock id in dev when the backend is unreachable.
    if (import.meta.env.DEV && isNetworkError(error)) {
      return { id: `sub-${Math.floor(Math.random() * 9000 + 1000)}` };
    }
    throw error;
  }
}
