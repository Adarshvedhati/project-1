import { Link } from "react-router-dom";
import type { SearchResultItem } from "../../../types";
import { AccessBadge } from "../Badge/Badge";
import { formatAuthors } from "../../../utils/formatAuthors";
import { formatDate } from "../../../utils/formatDate";
import styles from "./ContentCard.module.css";

const TYPE_LABEL: Record<SearchResultItem["contentType"], string> = {
  article: "Journal article",
  journal: "Journal",
  book: "Book",
  chapter: "Book chapter",
  case_study: "Case study",
};

const TYPE_ROUTE: Record<SearchResultItem["contentType"], string> = {
  article: "/articles",
  journal: "/journals",
  book: "/books",
  chapter: "/books",
  case_study: "/case-studies",
};

interface ContentCardProps {
  item: SearchResultItem;
}

/** The one generic result card used across search, home and listing pages. */
export function ContentCard({ item }: ContentCardProps) {
  const href = `${TYPE_ROUTE[item.contentType]}/${item.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.type}>{TYPE_LABEL[item.contentType]}</span>
        <AccessBadge accessType={item.accessType} />
      </div>
      <h3 className={styles.title}>
        <Link to={href}>{item.title}</Link>
      </h3>
      {item.parentTitle && <p className={styles.parent}>{item.parentTitle}</p>}
      <p className={styles.summary}>{item.summary}</p>
      <div className={styles.footer}>
        <span>{formatAuthors(item.authors)}</span>
        <span className={styles.dot} aria-hidden="true" />
        <span>{formatDate(item.publicationDate)}</span>
        {typeof item.citationCount === "number" && (
          <>
            <span className={styles.dot} aria-hidden="true" />
            <span>{item.citationCount} citations</span>
          </>
        )}
      </div>
    </article>
  );
}
