import { DataTable, type DataTableColumn } from "../../../components/ui";
import { formatDate } from "../../../utils/formatDate";
import type { AuditLogEntry } from "../types";

const COLUMNS: DataTableColumn<AuditLogEntry>[] = [
  { key: "actor", header: "Actor", render: (row) => row.actor },
  { key: "action", header: "Action", render: (row) => row.action },
  { key: "target", header: "Target", render: (row) => row.target },
  { key: "timestamp", header: "When", render: (row) => formatDate(row.timestamp, { hour: "numeric", minute: "2-digit" }) },
];

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  return <DataTable columns={COLUMNS} rows={entries} getRowId={(row) => row.id} />;
}
