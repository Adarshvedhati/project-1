import type { SearchResultItem } from "../types";

export interface CaseStudyDetail extends SearchResultItem {
  learningObjectives: string[];
  instructorResourcesAvailable: boolean;
}

export const CASE_STUDIES: CaseStudyDetail[] = [
  {
    id: "cs-3001",
    contentType: "case_study",
    title: "Scaling a Campus Food Bank: Logistics Under Constraint",
    authors: ["J. Alvarez"],
    summary:
      "A teaching case on last-mile logistics planning for a university food bank facing a sudden demand surge.",
    subject: "Operations Management",
    publicationDate: "2025-09-30",
    accessType: "free_preview",
    learningObjectives: [
      "Apply capacity-planning frameworks to a resource-constrained nonprofit",
      "Evaluate trade-offs between centralized and distributed distribution",
    ],
    instructorResourcesAvailable: true,
  },
  {
    id: "cs-3002",
    contentType: "case_study",
    title: "Negotiating Data-Sharing Agreements Between Rival Hospitals",
    authors: ["P. Nakamura", "C. Dubois"],
    summary:
      "Explores the governance and trust issues that arise when two competing hospital systems must share patient data.",
    subject: "Health & Medicine",
    publicationDate: "2026-03-11",
    accessType: "subscription",
    learningObjectives: [
      "Identify governance mechanisms that enable inter-organizational data sharing",
      "Assess ethical trade-offs in healthcare data negotiations",
    ],
    instructorResourcesAvailable: true,
  },
];

export const CASE_STUDY_SEARCH_RESULTS: SearchResultItem[] = CASE_STUDIES;
