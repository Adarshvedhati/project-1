import { Badge, DataTable, type DataTableColumn } from "../../../components/ui";
import { ROLE_LABELS } from "../../../constants/roles";
import type { AdminUserRow } from "../types";

const STATUS_TONE: Record<AdminUserRow["status"], "navy" | "ochre" | "slate" | "oxblood"> = {
  active: "navy",
  invited: "ochre",
  suspended: "oxblood",
};

const COLUMNS: DataTableColumn<AdminUserRow>[] = [
  { key: "name", header: "Name", render: (row) => row.name },
  { key: "email", header: "Email", render: (row) => row.email },
  { key: "roles", header: "Roles", render: (row) => row.roles.map((role) => ROLE_LABELS[role]).join(", ") },
  { key: "status", header: "Status", render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge> },
];

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  return <DataTable columns={COLUMNS} rows={users} getRowId={(row) => row.id} />;
}
