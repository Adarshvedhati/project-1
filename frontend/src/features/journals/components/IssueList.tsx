import { Link } from "react-router-dom";
import type { SearchResultItem } from "../../../types";
import { formatAuthors } from "../../../utils/formatAuthors";
import styles from "./IssueList.module.css";

/** Latest-issue article list on a journal page (section 4.3). */
export function IssueList({ articles }: { articles: SearchResultItem[] }) {
  if (articles.length === 0) {
    return <p className={styles.empty}>No articles have been published in this journal yet.</p>;
  }

  return (
    <ol className={styles.list}>
      {articles.map((article) => (
        <li key={article.id} className={styles.item}>
          <Link to={`/articles/${article.id}`} className={styles.title}>
            {article.title}
          </Link>
          <p className={styles.authors}>{formatAuthors(article.authors)}</p>
        </li>
      ))}
    </ol>
  );
}
