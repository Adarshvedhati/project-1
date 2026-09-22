import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { ARTICLE_SEARCH_RESULTS } from "../../../mocks/articles.mock";
import { JOURNAL_SEARCH_RESULTS } from "../../../mocks/journals.mock";
import { BOOK_SEARCH_RESULTS } from "../../../mocks/books.mock";
import { CASE_STUDY_SEARCH_RESULTS } from "../../../mocks/caseStudies.mock";
import type { SearchResponse } from "../types";

const ALL_RESULTS = [
  ...ARTICLE_SEARCH_RESULTS,
  ...JOURNAL_SEARCH_RESULTS,
  ...BOOK_SEARCH_RESULTS,
  ...CASE_STUDY_SEARCH_RESULTS,
];

/**
 * FR-02 (global search). Calls the future `/search` endpoint (backed by
 * OpenSearch — SRS section 6); falls back to filtering the local mock
 * corpus so search, filtering and pagination are demoable without a
 * backend.
 */
export async function search(query: string, page = 1, pageSize = 10): Promise<SearchResponse> {
  try {
    return await apiClient.get<SearchResponse>(
      `${ENDPOINTS.search}?q=${encodeURIComponent(query)}&page=${page}`,
      { auth: false }
    );
  } catch {
    const filtered = query
      ? ALL_RESULTS.filter((item) =>
          `${item.title} ${item.summary} ${item.authors.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : ALL_RESULTS;

    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }
}
