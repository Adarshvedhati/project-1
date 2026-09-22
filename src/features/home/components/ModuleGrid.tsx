import { Link } from "react-router-dom";
import styles from "./ModuleGrid.module.css";

const MODULES = [
  { title: "Journals", description: "Browse every title A–Z or by subject.", path: "/journals" },
  { title: "Books", description: "Monographs and edited collections.", path: "/books" },
  { title: "Case studies", description: "Teaching cases with instructor resources.", path: "/case-studies" },
  { title: "Publish with us", description: "Submission guidelines and the review workflow.", path: "/publish" },
  { title: "Open access", description: "What's free to read, and how licensing works.", path: "/open-access" },
  { title: "For librarians", description: "Subscriptions and institutional usage analytics.", path: "/institutions" },
];

export function ModuleGrid() {
  return (
    <ul className={styles.grid}>
      {MODULES.map((module) => (
        <li key={module.path}>
          <Link to={module.path} className={styles.card}>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
