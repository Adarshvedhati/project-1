import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { ARTICLES, type ArticleDetail } from "../../../mocks/articles.mock";

/** FR-05 (article publication, read side). */
export async function getArticle(id: string): Promise<ArticleDetail | undefined> {
  try {
    return await apiClient.get<ArticleDetail>(ENDPOINTS.article(id), { auth: false });
  } catch {
    return ARTICLES.find((article) => article.id === id);
  }
}

export async function getRelatedArticles(articleId: string, limit = 3): Promise<ArticleDetail[]> {
  return ARTICLES.filter((article) => article.id !== articleId).slice(0, limit);
}
