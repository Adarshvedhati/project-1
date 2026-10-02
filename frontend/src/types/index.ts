/**
 * Shared domain types, mirrored from the SRS database design (section 8).
 * Feature-level types that extend or narrow these live in each
 * `features/<name>/types.ts`.
 */

export type UUID = string;

export type Role =
  | "visitor"
  | "researcher"
  | "author"
  | "reviewer"
  | "editor"
  | "librarian"
  | "admin";

export type AccessType = "open_access" | "subscription" | "free_preview";

export type ContentType = "article" | "journal" | "book" | "chapter" | "case_study";

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  status: "active" | "invited" | "suspended";
  affiliation?: string;
  orcid?: string;
}

export interface Organization {
  id: UUID;
  name: string;
  type: "institution" | "library" | "publisher" | "funder";
  country: string;
}

export interface Author {
  id: UUID;
  name: string;
  affiliation?: string;
  orcid?: string;
}

export interface SearchFacets {
  contentType: ContentType[];
  subject: string[];
  accessType: AccessType[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResultItem {
  id: UUID;
  contentType: ContentType;
  title: string;
  authors: string[];
  summary: string;
  subject: string;
  publicationDate: string;
  accessType: AccessType;
  parentTitle?: string; // e.g. journal name for an article
  doi?: string;
  citationCount?: number;
}

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "published";

export type EditorialDecision = "desk_reject" | "revise" | "accept" | "reject" | "withdraw" | "publish";
