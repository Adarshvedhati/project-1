import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { formatDate } from "../utils/formatDate";
import { listBookmarks } from "../features/bookmarks/api/bookmarksApi";
import type { Bookmark } from "../features/bookmarks/types";
import styles from "./AccountPages.module.css";

const ROUTE_PREFIX: Record<Bookmark["contentType"], string> = {
  article: "/articles",
  journal: "/journals",
  book: "/books",
  case_study: "/case-studies",
};

/** SRS FR-09 — a signed-in researcher's saved reading list. */
export function AccountBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  useDocumentTitle("Bookmarks");

  useEffect(() => {
    listBookmarks().then(setBookmarks);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <h1>Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <EmptyState title="No bookmarks yet" description="Save articles, books and case studies to find them here." />
      ) : (
        <ul className={styles.list}>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className={styles.item}>
              <Link to={`${ROUTE_PREFIX[bookmark.contentType]}/${bookmark.contentId}`}>{bookmark.title}</Link>
              <span className={styles.savedAt}>Saved {formatDate(bookmark.savedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
