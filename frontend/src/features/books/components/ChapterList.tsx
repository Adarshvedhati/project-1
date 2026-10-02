import type { BookDetail } from "../../../mocks/books.mock";
import { formatAuthors } from "../../../utils/formatAuthors";
import styles from "./ChapterList.module.css";

export function ChapterList({ chapters }: { chapters: BookDetail["chapters"] }) {
  return (
    <ol className={styles.list}>
      {chapters.map((chapter, index) => (
        <li key={chapter.id} className={styles.item}>
          <span className={styles.number}>{index + 1}</span>
          <div>
            <p className={styles.title}>{chapter.title}</p>
            <p className={styles.authors}>{formatAuthors(chapter.authors)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
