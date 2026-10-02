import { useDocumentTitle } from "../hooks/useDocumentTitle";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  useDocumentTitle("About");

  return (
    <div className={`container ${styles.page}`}>
      <h1>About Meridian</h1>
      <p>
        Meridian is a research discovery and academic publishing platform bringing journals,
        books and teaching case studies together with a transparent submission and peer-review
        workflow for authors, reviewers, editors and institutions.
      </p>
      <p>
        This page is a placeholder for editorial and governance content — mission, editorial
        policies, indexing partners and contact details — to be filled in once available.
      </p>
    </div>
  );
}
