import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { REVIEW_INVITATIONS, type ReviewInvitation } from "../../../mocks/submissions.mock";

/** FR-07 (peer review workflow) — the reviewer's own queue. */
export async function listMyReviewInvitations(): Promise<ReviewInvitation[]> {
  try {
    return await apiClient.get<ReviewInvitation[]>(ENDPOINTS.reviewAssignments);
  } catch {
    return REVIEW_INVITATIONS;
  }
}
