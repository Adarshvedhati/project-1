import { DataTable, type DataTableColumn } from "../../../components/ui";
import type { EditorialQueueItem } from "../../../mocks/submissions.mock";
import { SUBMISSION_STATUS_LABELS } from "../../publishing/types";
import styles from "./SubmissionQueueTable.module.css";

interface SubmissionQueueTableProps {
  items: EditorialQueueItem[];
  onDecide: (id: string) => void;
}

export function SubmissionQueueTable({ items, onDecide }: SubmissionQueueTableProps) {
  const columns: DataTableColumn<EditorialQueueItem>[] = [
    { key: "title", header: "Submission", render: (row) => row.title },
    { key: "author", header: "Author", render: (row) => row.authorName },
    { key: "journal", header: "Journal", render: (row) => row.journal },
    { key: "status", header: "Status", render: (row) => SUBMISSION_STATUS_LABELS[row.status] },
    { key: "days", header: "Days in stage", render: (row) => row.daysInStage },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <button type="button" className={styles.action} onClick={() => onDecide(row.id)}>
          Record decision
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowId={(row) => row.id}
      emptyTitle="Queue is clear"
      emptyDescription="No submissions are currently awaiting an editorial decision."
    />
  );
}
