import type { SubmissionStatus } from "../../types";

export interface SubmissionDraft {
  title: string;
  abstract: string;
  contentType: "article" | "book_proposal" | "case_study";
  targetJournalId?: string;
  authorNames: string;
}

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  revision_requested: "Revision requested",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  published: "Published",
};

/** Ordered stages for the status tracker (SRS section 4.5 submission workflow). */
export const SUBMISSION_STAGES: SubmissionStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "revision_requested",
  "accepted",
  "published",
];
