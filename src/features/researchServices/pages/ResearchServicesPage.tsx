import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import styles from "./ResearchServicesPage.module.css";

const SERVICES = [
  { name: "Language editing", description: "Professional English-language editing before submission." },
  { name: "Data deposit support", description: "Guidance on preparing and depositing research data alongside your article." },
  { name: "Plagiarism & integrity screening", description: "Pre-submission similarity checks against the published literature." },
  { name: "Open access funding advice", description: "Help identifying funder and institutional support for article processing charges." },
];

/** Research Services module (SRS section 3, P1). */
export function ResearchServicesPage() {
  useDocumentTitle("Research Services");

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Research Services</h1>
        <p className={styles.intro}>
          Optional services to help authors prepare stronger, more discoverable submissions.
        </p>
      </header>

      <ul className={styles.grid}>
        {SERVICES.map((service) => (
          <li key={service.name} className={styles.card}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
