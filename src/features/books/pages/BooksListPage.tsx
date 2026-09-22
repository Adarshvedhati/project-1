import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatAuthors } from "../../../utils/formatAuthors";
import { listBooks } from "../api/booksApi";
import type { BookDetail } from "../../../mocks/books.mock";
import styles from "./BooksListPage.module.css";

/** Books gateway: discovery, subjects, series (SRS section 3). */
export function BooksListPage() {
  const [books, setBooks] = useState<BookDetail[]>([]);
  useDocumentTitle("Books");

  useEffect(() => {
    listBooks().then(setBooks);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Books</h1>
        <p className={styles.intro}>Scholarly books, monographs and edited collections.</p>
      </header>

      <ul className={styles.grid}>
        {books.map((book) => (
          <li key={book.id} className={styles.card}>
            <div className={styles.cover} aria-hidden="true" />
            <div>
              <AccessBadge accessType={book.accessType} />
              <h3 className={styles.title}>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </h3>
              <p className={styles.authors}>{formatAuthors(book.authors)}</p>
              <p className={styles.summary}>{book.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
