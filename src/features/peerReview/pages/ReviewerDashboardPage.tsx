import { useEffect, useState } from "react";
import { StatCard } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listMyReviewInvitations } from "../api/reviewsApi";
import { ReviewInvitationCard } from "../components/ReviewInvitationCard";
import type { ReviewInvitation } from "../../../mocks/submissions.mock";
import styles from "./ReviewerDashboardPage.module.css";

/** SRS section 13 "Reviewer Dashboard" — invitations, in-progress reviews, history. */
export function ReviewerDashboardPage() {
  const [invitations, setInvitations] = useState<ReviewInvitation[]>([]);
  useDocumentTitle("Reviewer Dashboard");

  useEffect(() => {
    listMyReviewInvitations().then(setInvitations);
  }, []);

  const pending = invitations.filter((i) => i.status === "invited").length;
  const inProgress = invitations.filter((i) => i.status === "accepted").length;

  return (
    <div>
      <h1>Reviewer dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="Pending invitations" value={pending} />
        <StatCard label="Reviews in progress" value={inProgress} />
        <StatCard label="Completed this year" value={6} />
      </div>

      <div className={styles.list}>
        {invitations.map((invitation) => (
          <ReviewInvitationCard key={invitation.id} invitation={invitation} />
        ))}
      </div>
    </div>
  );
}
