import { LinkButton } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import styles from "./PublishWithUsPage.module.css";

const STEPS = [
  {
    title: "Prepare your manuscript",
    body: "Format your submission to the target journal or series style, including abstract, keywords and references.",
  },
  {
    title: "Submit online",
    body: "Upload your manuscript and metadata through the submission dashboard. You can save a draft and return later.",
  },
  {
    title: "Peer review",
    body: "An editor assigns reviewers. You'll be notified as reviews and decisions are recorded.",
  },
  {
    title: "Revise or publish",
    body: "Address reviewer feedback if requested, then track your article through copyediting to publication.",
  },
];

/** SRS "Publish With Us" — author guidelines, publishing fees/OA policy overview, submission CTA. */
export function PublishWithUsPage() {
  useDocumentTitle("Publish With Us");

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Publish With Us</h1>
        <p className={styles.intro}>
          Meridian supports researchers publishing journal articles, books and teaching case
          studies. Every submission moves through the same transparent review and editorial
          workflow.
        </p>
        <LinkButton to="/publish/submissions/new">Start a new submission</LinkButton>
      </header>

      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className={styles.policySection}>
        <h2>Open access &amp; fees</h2>
        <p>
          Some journals publish under an open-access model with an article processing charge;
          others are subscription-funded with no charge to authors. Fee and licensing details are
          shown for each journal before you submit.
        </p>
      </section>
    </div>
  );
}
