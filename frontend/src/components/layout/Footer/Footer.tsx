import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const COLUMNS: { heading: string; links: { label: string; path: string }[] }[] = [
  {
    heading: "Discover",
    links: [
      { label: "Journals A–Z", path: "/journals" },
      { label: "Books", path: "/books" },
      { label: "Case studies", path: "/case-studies" },
      { label: "Open access", path: "/open-access" },
    ],
  },
  {
    heading: "Publish",
    links: [
      { label: "Author guidelines", path: "/publish" },
      { label: "Start a submission", path: "/publish/submissions/new" },
      { label: "Peer review", path: "/review" },
    ],
  },
  {
    heading: "Institutions",
    links: [
      { label: "For librarians", path: "/institutions" },
      { label: "Research services", path: "/research-services" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Meridian", path: "/about" },
      { label: "Sign in", path: "/sign-in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>Meridian</p>
          <p className={styles.tagline}>
            An academic publishing and research discovery platform for journals, books
            and case studies.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className={styles.columnHeading}>{column.heading}</p>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`container ${styles.legal}`}>
        <span>© {new Date().getFullYear()} Meridian Research Platform.</span>
      </div>
    </footer>
  );
}
