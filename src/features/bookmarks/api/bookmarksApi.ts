import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type { Bookmark } from "../types";

const MOCK_BOOKMARKS: Bookmark[] = [
  { id: "bm-1", contentId: "a-1002", contentType: "article", title: "Circular Inventory Models for Regional Food Supply Chains", savedAt: "2026-08-30" },
];

/** FR-09 (bookmarks / reading list). */
export async function listBookmarks(): Promise<Bookmark[]> {
  try {
    return await apiClient.get<Bookmark[]>(ENDPOINTS.bookmarks);
  } catch {
    return MOCK_BOOKMARKS;
  }
}
