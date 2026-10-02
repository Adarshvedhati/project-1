import { useState } from "react";
import { DataTable, type DataTableColumn } from "../../../components/ui";
import type { EditorialQueueItem } from "../../../mocks/submissions.mock";
import type { EditorialDecision } from "../../../types";
import { SUBMISSION_STATUS_LABELS } from "../../publishing/types";
import styles from "./SubmissionQueueTable.module.css";

interface SubmissionQueueTableProps {
  items: EditorialQueueItem[];
  onDecide: (id: string, decision: EditorialDecision) => void;
}

const DECISION_LABELS: Record<EditorialDecision, string> = {
  accept: "Accept",
  revise: "Request revision",
  reject: "Reject",
  desk_reject: "Desk reject",
  publish: "Publish",
  withdraw: "Withdraw",
};

/** Which decisions make sense from each status (mirrors the backend rules). */
const ALLOWED: Partial<Record<EditorialQueueItem["status"], EditorialDecision[]>> = {
  submitted: ["accept", "revise", "reject", "desk_reject", "withdraw"],
  under_review: ["accept", "revise", "reject", "withdraw"],
  revision_requested: ["accept", "reject", "withdraw"],
  accepted: ["publish", "withdraw"],
};

function DecisionControl({ item, onDecide }: { item: EditorialQueueItem; onDecide: SubmissionQueueTableProps["onDecide"] }) {
  const options = ALLOWED[item.status] ?? [];
  const [decision, setDecision] = useState<EditorialDecision | "">("");
  if (options.length === 0) return null;

  return (
    <span className={styles.control}>
      <select
        aria-label={`Decision for ${item.title}`}
        value={decision}
        onChange={(e) => setDecision(e.target.value as EditorialDecision)}
      >
        <option value="" disabled>
          Decision…
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {DECISION_LABELS[option]}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.action}
        disabled={decision === ""}
        onClick={() => decision && onDecide(item.id, decision)}
      >
        Record decision
      </button>
    </span>
  );
}

export function SubmissionQueueTable({ items, onDecide }: SubmissionQueueTableProps) {
  const columns: DataTableColumn<EditorialQueueItem>[] = [
    { key: "title", header: "Submission", render: (row) => row.title },
    { key: "author", header: "Author", render: (row) => row.authorName },
    { key: "journal", header: "Journal", render: (row) => row.journal },
    { key: "status", header: "Status", render: (row) => SUBMISSION_STATUS_LABELS[row.status] },
    { key: "days", header: "Days in stage", render: (row) => row.daysInStage },
    { key: "actions", header: "", render: (row) => <DecisionControl item={row} onDecide={onDecide} /> },
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
