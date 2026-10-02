import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatAuthors } from "../../../utils/formatAuthors";
import { getCaseStudy } from "../api/caseStudiesApi";
import type { CaseStudyDetail } from "../../../mocks/caseStudies.mock";
import styles from "./CaseStudyDetailPage.module.css";

export function CaseStudyDetailPage() {
  const { caseStudyId = "" } = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudyDetail | undefined>();
  useDocumentTitle(caseStudy?.title ?? "Case study");

  useEffect(() => {
    getCaseStudy(caseStudyId).then(setCaseStudy);
  }, [caseStudyId]);

  if (!caseStudy) {
    return <div className="container">Loading case study…</div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <AccessBadge accessType={caseStudy.accessType} />
      <h1 className={styles.title}>{caseStudy.title}</h1>
      <p className={styles.authors}>{formatAuthors(caseStudy.authors)}</p>
      <p className={styles.summary}>{caseStudy.summary}</p>

      <section className={styles.section}>
        <h2>Learning objectives</h2>
        <ul className={styles.objectives}>
          {caseStudy.learningObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      {caseStudy.instructorResourcesAvailable && (
        <section className={styles.section}>
          <h2>Instructor resources</h2>
          <p className={styles.note}>
            A teaching note, discussion questions and a suggested classroom plan are available to
            verified instructors. Sign in with an institutional account to request access.
          </p>
        </section>
      )}
    </div>
  );
}
