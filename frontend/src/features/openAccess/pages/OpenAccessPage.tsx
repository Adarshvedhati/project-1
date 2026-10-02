import { AccessBadge } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import styles from "./OpenAccessPage.module.css";

const FAQS = [
  {
    q: "What does open access mean on Meridian?",
    a: "Open-access content is free to read and reuse under the license shown on each article, with no subscription or paywall.",
  },
  {
    q: "Do authors pay to publish open access?",
    a: "Some open-access journals charge an article processing charge (APC); others are fully funded and free for authors. Each journal states its policy before submission.",
  },
  {
    q: "How is open-access content licensed?",
    a: "Most open-access content on Meridian is published under a Creative Commons license, specified on the article page.",
  },
];

/** Open Access module: policy explanation, licensing, FAQs (SRS section 3, P1). */
export function OpenAccessPage() {
  useDocumentTitle("Open Access");

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <AccessBadge accessType="open_access" />
        <h1>Open Access</h1>
        <p className={styles.intro}>
          Meridian publishes a growing share of its journals, books and case studies under open
          access, making the research freely available to read, download and reuse.
        </p>
      </header>

      <dl className={styles.faqs}>
        {FAQS.map((item) => (
          <div key={item.q} className={styles.faqItem}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
