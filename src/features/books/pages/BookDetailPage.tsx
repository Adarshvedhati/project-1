import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatAuthors } from "../../../utils/formatAuthors";
import { formatDate } from "../../../utils/formatDate";
import { getBook } from "../api/booksApi";
import { ChapterList } from "../components/ChapterList";
import type { BookDetail } from "../../../mocks/books.mock";
import styles from "./BookDetailPage.module.css";

/** SRS section 13 "Book Page": cover, authors, ISBN, description, chapters, access. */
export function BookDetailPage() {
  const { bookId = "" } = useParams();
  const [book, setBook] = useState<BookDetail | undefined>();
  useDocumentTitle(book?.title ?? "Book");

  useEffect(() => {
    getBook(bookId).then(setBook);
  }, [bookId]);

  if (!book) {
    return <div className="container">Loading book…</div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <div className={styles.cover} aria-hidden="true" />

        <div>
          <AccessBadge accessType={book.accessType} />
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.authors}>{formatAuthors(book.authors)}</p>
          <p className={styles.meta}>
            <span>ISBN {book.isbn}</span>
            <span className={styles.metaDivider} aria-hidden="true" />
            <span>Published {formatDate(book.publicationDate)}</span>
          </p>

          <p className={styles.description}>{book.summary}</p>

          <section className={styles.section}>
            <h2>Chapters</h2>
            <ChapterList chapters={book.chapters} />
          </section>
        </div>
      </div>
    </div>
  );
}
