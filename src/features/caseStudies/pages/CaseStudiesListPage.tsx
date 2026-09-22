import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatAuthors } from "../../../utils/formatAuthors";
import { listCaseStudies } from "../api/caseStudiesApi";
import type { CaseStudyDetail } from "../../../mocks/caseStudies.mock";
import styles from "./CaseStudiesListPage.module.css";

/** Case Studies module: teaching cases, learning objectives, instructor resources. */
export function CaseStudiesListPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyDetail[]>([]);
  useDocumentTitle("Case Studies");

  useEffect(() => {
    listCaseStudies().then(setCaseStudies);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Case Studies</h1>
        <p className={styles.intro}>
          Teaching cases with learning objectives and instructor resources, for use in graduate
          and executive-education classrooms.
        </p>
      </header>

      <ul className={styles.list}>
        {caseStudies.map((cs) => (
          <li key={cs.id} className={styles.card}>
            <div className={styles.top}>
              <AccessBadge accessType={cs.accessType} />
              {cs.instructorResourcesAvailable && (
                <span className={styles.instructorTag}>Instructor resources available</span>
              )}
            </div>
            <h3>
              <Link to={`/case-studies/${cs.id}`}>{cs.title}</Link>
            </h3>
            <p className={styles.authors}>{formatAuthors(cs.authors)}</p>
            <p className={styles.summary}>{cs.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
