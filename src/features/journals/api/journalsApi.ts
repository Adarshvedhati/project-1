import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { JOURNALS, type JournalSummary } from "../../../mocks/journals.mock";
import { ARTICLES } from "../../../mocks/articles.mock";
import type { SearchResultItem } from "../../../types";

/** FR-03 (journal management, read side) + section 4.3 journal structure. */
export async function listJournals(): Promise<JournalSummary[]> {
  try {
    return await apiClient.get<JournalSummary[]>(ENDPOINTS.journals, { auth: false });
  } catch {
    return JOURNALS;
  }
}

export async function getJournal(id: string): Promise<JournalSummary | undefined> {
  try {
    return await apiClient.get<JournalSummary>(ENDPOINTS.journal(id), { auth: false });
  } catch {
    return JOURNALS.find((journal) => journal.id === id);
  }
}

export async function getJournalArticles(journalId: string): Promise<SearchResultItem[]> {
  return ARTICLES.filter((article) => article.journalId === journalId);
}
