import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listJournals } from "../api/journalsApi";
import type { JournalSummary } from "../../../mocks/journals.mock";
import styles from "./JournalsListPage.module.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Journals gateway: A–Z browsing + subject filters (SRS section 3, 4.1). */
export function JournalsListPage() {
  const [journals, setJournals] = useState<JournalSummary[]>([]);
  const [subject, setSubject] = useState<string | null>(null);
  useDocumentTitle("Journals");

  useEffect(() => {
    listJournals().then(setJournals);
  }, []);

  const subjects = Array.from(new Set(journals.map((j) => j.subject))).sort();
  const visible = subject ? journals.filter((j) => j.subject === subject) : journals;

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Journals</h1>
        <p className={styles.intro}>
          Browse every journal on Meridian by subject, or jump straight to a title using the
          A–Z index.
        </p>
      </header>

      <div className={styles.azIndex} aria-label="Browse journals alphabetically">
        {LETTERS.map((letter) => (
          <span key={letter} className={styles.letter}>
            {letter}
          </span>
        ))}
      </div>

      <div className={styles.subjectRow}>
        <button
          type="button"
          className={`${styles.subjectPill} ${subject === null ? styles.active : ""}`}
          onClick={() => setSubject(null)}
        >
          All subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.subjectPill} ${subject === s ? styles.active : ""}`}
            onClick={() => setSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <ul className={styles.grid}>
        {visible.map((journal) => (
          <li key={journal.id} className={styles.card}>
            <div className={styles.cardTop}>
              <AccessBadge accessType={journal.accessType} />
              <span className={styles.issn}>ISSN {journal.issn}</span>
            </div>
            <h3>
              <Link to={`/journals/${journal.id}`}>{journal.title}</Link>
            </h3>
            <p className={styles.scope}>{journal.scope}</p>
            <p className={styles.volume}>{journal.latestVolume}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
