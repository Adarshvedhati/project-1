import { useEffect, useState } from "react";
import { DataTable, type DataTableColumn, LinkButton } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { formatDate } from "../../../utils/formatDate";
import { listMySubmissions } from "../api/submissionsApi";
import { SubmissionStatusTracker } from "../components/SubmissionStatusTracker";
import type { SubmissionSummary } from "../../../mocks/submissions.mock";
import styles from "./SubmissionDashboardPage.module.css";

const COLUMNS: DataTableColumn<SubmissionSummary>[] = [
  { key: "title", header: "Title", render: (row) => row.title },
  { key: "journal", header: "Journal / series", render: (row) => row.journalOrSeries },
  { key: "status", header: "Status", render: (row) => <SubmissionStatusTracker status={row.status} /> },
  { key: "updated", header: "Last updated", render: (row) => formatDate(row.lastUpdatedAt) },
];

/** SRS section 13 "Submission Dashboard" — the author's view of their work in progress. */
export function SubmissionDashboardPage() {
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  useDocumentTitle("My Submissions");

  useEffect(() => {
    listMySubmissions().then(setSubmissions);
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h1>My submissions</h1>
        <LinkButton to="/publish/submissions/new" size="sm">
          New submission
        </LinkButton>
      </div>
      <DataTable
        columns={COLUMNS}
        rows={submissions}
        getRowId={(row) => row.id}
        emptyTitle="No submissions yet"
        emptyDescription="Once you submit a manuscript, its status will appear here."
      />
    </div>
  );
}
