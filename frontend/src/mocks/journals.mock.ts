import type { SearchResultItem } from "../types";

export interface JournalSummary {
  id: string;
  title: string;
  issn: string;
  scope: string;
  subject: string;
  accessType: "open_access" | "subscription" | "free_preview";
  latestVolume: string;
}

export const JOURNALS: JournalSummary[] = [
  {
    id: "j-applied-linguistics",
    title: "Journal of Applied Linguistics & Pedagogy",
    issn: "2451-0982",
    scope: "Language teaching, second-language acquisition and curriculum design.",
    subject: "Education",
    accessType: "subscription",
    latestVolume: "Vol. 14, Issue 3",
  },
  {
    id: "j-sustainable-operations",
    title: "Sustainable Operations & Supply Chains",
    issn: "2667-1145",
    scope: "Operations research with an emphasis on sustainability and circular supply chains.",
    subject: "Business & Management",
    accessType: "open_access",
    latestVolume: "Vol. 8, Issue 2",
  },
  {
    id: "j-digital-health",
    title: "Digital Health Systems Review",
    issn: "2789-3301",
    scope: "Health informatics, clinical data systems and digital-care delivery.",
    subject: "Health & Medicine",
    accessType: "subscription",
    latestVolume: "Vol. 5, Issue 1",
  },
  {
    id: "j-materials-eng",
    title: "Advances in Materials Engineering",
    issn: "2334-8827",
    scope: "Materials science, structural testing and manufacturing processes.",
    subject: "Engineering",
    accessType: "free_preview",
    latestVolume: "Vol. 21, Issue 4",
  },
];

export const JOURNAL_SEARCH_RESULTS: SearchResultItem[] = JOURNALS.map((journal) => ({
  id: journal.id,
  contentType: "journal",
  title: journal.title,
  authors: [],
  summary: journal.scope,
  subject: journal.subject,
  publicationDate: "2026-01-01",
  accessType: journal.accessType,
}));
