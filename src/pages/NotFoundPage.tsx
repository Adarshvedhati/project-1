import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <div className={`container ${styles.page}`}>
      <p className={styles.code}>404</p>
      <h1>We couldn't find that page</h1>
      <p className={styles.body}>The page may have moved, or the link may be out of date.</p>
      <Link to="/" className={styles.link}>
        Return home
      </Link>
    </div>
  );
}
