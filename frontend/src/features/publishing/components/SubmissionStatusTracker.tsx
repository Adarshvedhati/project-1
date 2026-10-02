import type { SubmissionStatus } from "../../../types";
import { SUBMISSION_STAGES, SUBMISSION_STATUS_LABELS } from "../types";
import styles from "./SubmissionStatusTracker.module.css";

export function SubmissionStatusTracker({ status }: { status: SubmissionStatus }) {
  const isTerminalOutlier = !SUBMISSION_STAGES.includes(status); // rejected / withdrawn
  const currentIndex = SUBMISSION_STAGES.indexOf(status);

  if (isTerminalOutlier) {
    return <p className={styles.outlier}>{SUBMISSION_STATUS_LABELS[status]}</p>;
  }

  return (
    <ol className={styles.tracker}>
      {SUBMISSION_STAGES.map((stage, index) => (
        <li
          key={stage}
          className={`${styles.step} ${index <= currentIndex ? styles.done : ""} ${
            index === currentIndex ? styles.current : ""
          }`}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.label}>{SUBMISSION_STATUS_LABELS[stage]}</span>
        </li>
      ))}
    </ol>
  );
}
