import type { ContentType, SearchFacets, SearchResultItem } from "../../types";

export interface SearchQuery {
  q: string;
  page: number;
  facets: Partial<Record<keyof SearchFacets, string[]>>;
}

export interface SearchResponse {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const SEARCH_CONTENT_TYPES: { key: ContentType; label: string }[] = [
  { key: "article", label: "Articles" },
  { key: "journal", label: "Journals" },
  { key: "book", label: "Books" },
  { key: "case_study", label: "Case studies" },
];
