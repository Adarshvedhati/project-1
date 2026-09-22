import { useNavigate } from "react-router-dom";
import { SearchBar } from "../../../components/ui";
import styles from "./Hero.module.css";

/**
 * Editorial masthead hero — search is the primary discovery action
 * (SRS section 14), styled like a journal front page rather than a
 * generic SaaS gradient banner.
 */
export function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.kicker}>Meridian Research Platform</p>
        <h1 className={styles.headline}>Discover journals, books and case studies worth citing.</h1>
        <p className={styles.subhead}>
          Search across peer-reviewed articles, scholarly books and teaching case studies —
          published under open access, subscription or free preview.
        </p>
        <div className={styles.searchWrap}>
          <SearchBar
            size="lg"
            placeholder="Search by title, author, keyword or DOI…"
            onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
          />
        </div>
      </div>
    </section>
  );
}
