import { useEffect, useState } from "react";
import { StatCard } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listMyReviewInvitations, respondToInvitation } from "../api/reviewsApi";
import { ReviewInvitationCard } from "../components/ReviewInvitationCard";
import type { ReviewInvitation } from "../../../mocks/submissions.mock";
import styles from "./ReviewerDashboardPage.module.css";

/** SRS section 13 "Reviewer Dashboard" — invitations, in-progress reviews, history. */
export function ReviewerDashboardPage() {
  const [invitations, setInvitations] = useState<ReviewInvitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  useDocumentTitle("Reviewer Dashboard");

  useEffect(() => {
    listMyReviewInvitations()
      .then(setInvitations)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleRespond(id: string, status: "accepted" | "declined") {
    setError(null);
    try {
      const updated = await respondToInvitation(id, status);
      setInvitations((items) => items.map((item) => (item.id === id ? { ...item, status: updated.status } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the invitation.");
    }
  }

  const pending = invitations.filter((i) => i.status === "invited").length;
  const inProgress = invitations.filter((i) => i.status === "accepted").length;

  return (
    <div>
      <h1>Reviewer dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="Pending invitations" value={pending} />
        <StatCard label="Reviews in progress" value={inProgress} />
        <StatCard label="Completed reviews" value={invitations.filter((i) => i.status === "submitted").length} />
      </div>

      {error && <p role="alert">{error}</p>}

      <div className={styles.list}>
        {invitations.map((invitation) => (
          <ReviewInvitationCard key={invitation.id} invitation={invitation} onRespond={handleRespond} />
        ))}
      </div>
    </div>
  );
}
