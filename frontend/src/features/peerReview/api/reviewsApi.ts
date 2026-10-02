import { apiClient, isNetworkError } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { REVIEW_INVITATIONS, type ReviewInvitation } from "../../../mocks/submissions.mock";

/** FR-07 (peer review workflow) — the reviewer's own queue. */
export async function listMyReviewInvitations(): Promise<ReviewInvitation[]> {
  try {
    return await apiClient.get<ReviewInvitation[]>(`${ENDPOINTS.reviewAssignments}?scope=mine`);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) return REVIEW_INVITATIONS;
    throw error;
  }
}

export async function respondToInvitation(id: string, status: "accepted" | "declined"): Promise<ReviewInvitation> {
  return apiClient.patch<ReviewInvitation>(ENDPOINTS.reviewAssignment(id), { status });
}
