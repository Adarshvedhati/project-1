import { ContentCard } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { ARTICLE_SEARCH_RESULTS } from "../../../mocks/articles.mock";
import { BOOK_SEARCH_RESULTS } from "../../../mocks/books.mock";
import { CASE_STUDY_SEARCH_RESULTS } from "../../../mocks/caseStudies.mock";
import { Hero } from "../components/Hero";
import { ModuleGrid } from "../components/ModuleGrid";
import styles from "./HomePage.module.css";

const FEATURED = [ARTICLE_SEARCH_RESULTS[0], BOOK_SEARCH_RESULTS[1], CASE_STUDY_SEARCH_RESULTS[0]];

/** SRS section 13 "Home Page": hero + search, featured content, module entry points. */
export function HomePage() {
  useDocumentTitle("Home");

  return (
    <div>
      <Hero />

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>Recently published</h2>
        </div>
        <div>
          {FEATURED.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>Explore Meridian</h2>
        </div>
        <ModuleGrid />
      </section>
    </div>
  );
}
