import type { SearchResultItem } from "../types";

export interface ArticleDetail extends SearchResultItem {
  journalId: string;
  keywords: string[];
  fullTextAvailable: boolean;
}

export const ARTICLES: ArticleDetail[] = [
  {
    id: "a-1001",
    contentType: "article",
    journalId: "j-applied-linguistics",
    title: "Task-Based Instruction and Learner Autonomy in Hybrid Classrooms",
    authors: ["R. Fernandes", "M. Okonkwo"],
    summary:
      "A mixed-methods study of task-based language teaching across twelve hybrid classrooms, examining its effect on learner autonomy.",
    subject: "Education",
    publicationDate: "2026-06-12",
    accessType: "open_access",
    parentTitle: "Journal of Applied Linguistics & Pedagogy",
    doi: "10.5555/jalp.2026.1001",
    citationCount: 4,
    keywords: ["language teaching", "learner autonomy", "hybrid learning"],
    fullTextAvailable: true,
  },
  {
    id: "a-1002",
    contentType: "article",
    journalId: "j-sustainable-operations",
    title: "Circular Inventory Models for Regional Food Supply Chains",
    authors: ["T. Andersson"],
    summary:
      "Proposes a circular inventory model reducing waste in regional food distribution networks, validated against three case regions.",
    subject: "Business & Management",
    publicationDate: "2026-04-02",
    accessType: "open_access",
    parentTitle: "Sustainable Operations & Supply Chains",
    doi: "10.5555/sosc.2026.1002",
    citationCount: 11,
    keywords: ["circular economy", "inventory management", "food supply chains"],
    fullTextAvailable: true,
  },
  {
    id: "a-1003",
    contentType: "article",
    journalId: "j-digital-health",
    title: "Interoperability Gaps in Regional Electronic Health Record Systems",
    authors: ["S. Kapoor", "L. Bianchi", "H. Weiss"],
    summary:
      "Surveys interoperability barriers across five regional EHR deployments and proposes a shared metadata schema.",
    subject: "Health & Medicine",
    publicationDate: "2026-02-20",
    accessType: "subscription",
    parentTitle: "Digital Health Systems Review",
    doi: "10.5555/dhsr.2026.1003",
    citationCount: 7,
    keywords: ["EHR", "interoperability", "health informatics"],
    fullTextAvailable: false,
  },
];

export const ARTICLE_SEARCH_RESULTS: SearchResultItem[] = ARTICLES;
