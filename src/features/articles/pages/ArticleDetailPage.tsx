import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatAuthors } from "../../../utils/formatAuthors";
import { formatDate } from "../../../utils/formatDate";
import { getArticle, getRelatedArticles } from "../api/articlesApi";
import { CitationExport } from "../components/CitationExport";
import { RelatedArticles } from "../components/RelatedArticles";
import type { ArticleDetail } from "../../../mocks/articles.mock";
import styles from "./ArticleDetailPage.module.css";

/** SRS section 13 "Article Page": title, authors, abstract, DOI, access, citations, related content. */
export function ArticleDetailPage() {
  const { articleId = "" } = useParams();
  const [article, setArticle] = useState<ArticleDetail | undefined>();
  const [related, setRelated] = useState<ArticleDetail[]>([]);
  useDocumentTitle(article?.title ?? "Article");

  useEffect(() => {
    getArticle(articleId).then((found) => {
      setArticle(found);
      if (found) getRelatedArticles(found.id).then(setRelated);
    });
  }, [articleId]);

  if (!article) {
    return <div className="container">Loading article…</div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <article>
          {article.parentTitle && (
            <Link to={`/journals/${article.journalId}`} className={styles.journalLink}>
              {article.parentTitle}
            </Link>
          )}
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.authors}>{formatAuthors(article.authors)}</p>

          <div className={styles.metaRow}>
            <AccessBadge accessType={article.accessType} />
            <span>{formatDate(article.publicationDate)}</span>
            {article.doi && <span>DOI: {article.doi}</span>}
          </div>

          <section className={styles.section}>
            <h2>Abstract</h2>
            <p>{article.summary}</p>
          </section>

          <section className={styles.section}>
            <h2>Keywords</h2>
            <ul className={styles.keywords}>
              {article.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Full text</h2>
            {article.fullTextAvailable ? (
              <p>
                Full text is available for this article. In production this section streams the
                PDF/HTML content from object storage (SRS section 6).
              </p>
            ) : (
              <p>
                Full text is restricted under a subscription or institutional license. Sign in
                with an eligible account to read the full article.
              </p>
            )}
          </section>

          <section className={styles.section}>
            <h2>Metrics</h2>
            <p>{article.citationCount ?? 0} citations recorded to date.</p>
          </section>
        </article>

        <aside className={styles.sidebar}>
          <CitationExport article={article} />
          <RelatedArticles articles={related} />
        </aside>
      </div>
    </div>
  );
}
