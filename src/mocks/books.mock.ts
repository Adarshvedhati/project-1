import type { SearchResultItem } from "../types";

export interface BookDetail extends SearchResultItem {
  isbn: string;
  chapters: { id: string; title: string; authors: string[] }[];
}

export const BOOKS: BookDetail[] = [
  {
    id: "b-2001",
    contentType: "book",
    title: "Foundations of Regional Innovation Policy",
    authors: ["E. Moreau", "D. Osei"],
    summary:
      "A graduate-level text on how regional governments design and evaluate innovation-policy instruments.",
    subject: "Public Policy",
    publicationDate: "2025-11-04",
    accessType: "subscription",
    isbn: "978-1-2345-6789-0",
    chapters: [
      { id: "b-2001-c1", title: "Why Regions, Not Just Nations", authors: ["E. Moreau"] },
      { id: "b-2001-c2", title: "Instruments for Cluster Formation", authors: ["D. Osei"] },
      { id: "b-2001-c3", title: "Measuring Policy Impact", authors: ["E. Moreau", "D. Osei"] },
    ],
  },
  {
    id: "b-2002",
    contentType: "book",
    title: "Open Data Governance for Public Institutions",
    authors: ["N. Petrova"],
    summary: "Practical governance frameworks for institutions publishing open research and civic data.",
    subject: "Information Science",
    publicationDate: "2026-01-18",
    accessType: "open_access",
    isbn: "978-1-2345-6790-6",
    chapters: [
      { id: "b-2002-c1", title: "Principles of Open Data Governance", authors: ["N. Petrova"] },
      { id: "b-2002-c2", title: "Licensing and Attribution", authors: ["N. Petrova"] },
    ],
  },
];

export const BOOK_SEARCH_RESULTS: SearchResultItem[] = BOOKS;
