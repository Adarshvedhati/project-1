import { Link } from "react-router-dom";
import type { ArticleDetail } from "../../../mocks/articles.mock";
import styles from "./RelatedArticles.module.css";

export function RelatedArticles({ articles }: { articles: ArticleDetail[] }) {
  if (articles.length === 0) return null;
  return (
    <div>
      <p className={styles.heading}>Related articles</p>
      <ul className={styles.list}>
        {articles.map((article) => (
          <li key={article.id}>
            <Link to={`/articles/${article.id}`} className={styles.link}>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
