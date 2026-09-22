import { Badge } from "../../../components/ui";
import { formatDate } from "../../../utils/formatDate";
import type { ReviewInvitation } from "../../../mocks/submissions.mock";
import styles from "./ReviewInvitationCard.module.css";

const STATUS_TONE: Record<ReviewInvitation["status"], "navy" | "ochre" | "slate" | "oxblood"> = {
  invited: "ochre",
  accepted: "navy",
  declined: "slate",
  submitted: "oxblood",
};

const STATUS_LABEL: Record<ReviewInvitation["status"], string> = {
  invited: "Invitation pending",
  accepted: "In progress",
  declined: "Declined",
  submitted: "Review submitted",
};

export function ReviewInvitationCard({ invitation }: { invitation: ReviewInvitation }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <Badge tone={STATUS_TONE[invitation.status]}>{STATUS_LABEL[invitation.status]}</Badge>
        <span className={styles.due}>Due {formatDate(invitation.dueDate)}</span>
      </div>
      <h3 className={styles.title}>{invitation.submissionTitle}</h3>
      <p className={styles.journal}>{invitation.journal}</p>
      {invitation.status === "invited" && (
        <div className={styles.actions}>
          <button type="button" className={styles.accept}>
            Accept
          </button>
          <button type="button" className={styles.decline}>
            Decline
          </button>
        </div>
      )}
      {invitation.status === "accepted" && (
        <div className={styles.actions}>
          <button type="button" className={styles.accept}>
            Write review
          </button>
        </div>
      )}
    </div>
  );
}
