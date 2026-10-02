import type { EditorialDecision, SubmissionStatus } from "../types";

export interface SubmissionSummary {
  id: string;
  title: string;
  contentType: "article" | "book_proposal" | "case_study";
  journalOrSeries: string;
  status: SubmissionStatus;
  submittedAt: string;
  lastUpdatedAt: string;
}

export const MY_SUBMISSIONS: SubmissionSummary[] = [
  {
    id: "sub-501",
    title: "Adaptive Assessment Design in Large Enrollment Courses",
    contentType: "article",
    journalOrSeries: "Journal of Applied Linguistics & Pedagogy",
    status: "under_review",
    submittedAt: "2026-07-01",
    lastUpdatedAt: "2026-08-14",
  },
  {
    id: "sub-502",
    title: "Modeling Reverse Logistics for Regional Retailers",
    contentType: "article",
    journalOrSeries: "Sustainable Operations & Supply Chains",
    status: "revision_requested",
    submittedAt: "2026-05-22",
    lastUpdatedAt: "2026-09-02",
  },
  {
    id: "sub-503",
    title: "Governing Shared Clinical Datasets",
    contentType: "case_study",
    journalOrSeries: "Case Study Collection — Health & Medicine",
    status: "draft",
    submittedAt: "2026-09-10",
    lastUpdatedAt: "2026-09-10",
  },
];

export interface ReviewInvitation {
  id: string;
  submissionTitle: string;
  journal: string;
  dueDate: string;
  status: "invited" | "accepted" | "declined" | "submitted";
}

export const REVIEW_INVITATIONS: ReviewInvitation[] = [
  {
    id: "rev-701",
    submissionTitle: "Circular Inventory Models for Regional Food Supply Chains — Revision 2",
    journal: "Sustainable Operations & Supply Chains",
    dueDate: "2026-09-28",
    status: "accepted",
  },
  {
    id: "rev-702",
    submissionTitle: "Interoperability Gaps in Regional Electronic Health Record Systems",
    journal: "Digital Health Systems Review",
    dueDate: "2026-10-05",
    status: "invited",
  },
];

export interface EditorialQueueItem {
  id: string;
  title: string;
  authorName: string;
  journal: string;
  status: SubmissionStatus;
  daysInStage: number;
  lastDecision?: EditorialDecision;
}

export const EDITORIAL_QUEUE: EditorialQueueItem[] = [
  {
    id: "sub-441",
    title: "Task-Based Instruction and Learner Autonomy in Hybrid Classrooms — Revision",
    authorName: "R. Fernandes",
    journal: "Journal of Applied Linguistics & Pedagogy",
    status: "under_review",
    daysInStage: 6,
  },
  {
    id: "sub-455",
    title: "Predictive Maintenance in Mid-Size Manufacturing Plants",
    authorName: "K. Novak",
    journal: "Advances in Materials Engineering",
    status: "submitted",
    daysInStage: 2,
  },
  {
    id: "sub-460",
    title: "Learner Feedback Loops in Adaptive Assessment Platforms",
    authorName: "A. Haddad",
    journal: "Journal of Applied Linguistics & Pedagogy",
    status: "accepted",
    daysInStage: 0,
    lastDecision: "accept",
  },
];
