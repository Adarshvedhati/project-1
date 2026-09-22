import { useEffect, useState } from "react";
import { StatCard } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listEditorialQueue, recordDecision } from "../api/editorialApi";
import { SubmissionQueueTable } from "../components/SubmissionQueueTable";
import type { EditorialQueueItem } from "../../../mocks/submissions.mock";
import styles from "./EditorDashboardPage.module.css";

/** SRS section 13 "Editor Dashboard" — submission queue, reviewer assignment, decisions, issue planning. */
export function EditorDashboardPage() {
  const [queue, setQueue] = useState<EditorialQueueItem[]>([]);
  useDocumentTitle("Editor Dashboard");

  useEffect(() => {
    listEditorialQueue().then(setQueue);
  }, []);

  async function handleDecide(id: string) {
    await recordDecision(id, "accept");
  }

  const awaitingDecision = queue.filter((item) => item.status === "under_review").length;
  const newSubmissions = queue.filter((item) => item.status === "submitted").length;

  return (
    <div>
      <h1>Editor dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="New submissions" value={newSubmissions} />
        <StatCard label="Awaiting decision" value={awaitingDecision} />
        <StatCard label="Issue in planning" value="Vol. 14, Issue 4" />
      </div>

      <h2 className={styles.sectionHeading}>Submission queue</h2>
      <SubmissionQueueTable items={queue} onDecide={handleDecide} />
    </div>
  );
}
