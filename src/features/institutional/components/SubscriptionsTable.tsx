import { DataTable, type DataTableColumn } from "../../../components/ui";
import { formatDate } from "../../../utils/formatDate";
import type { InstitutionSubscription } from "../types";

const COLUMNS: DataTableColumn<InstitutionSubscription>[] = [
  { key: "journal", header: "Journal", render: (row) => row.journalTitle },
  { key: "plan", header: "Plan", render: (row) => (row.plan === "full-text" ? "Full text" : "Abstract only") },
  { key: "renewal", header: "Renews", render: (row) => formatDate(row.renewalDate) },
];

export function SubscriptionsTable({ subscriptions }: { subscriptions: InstitutionSubscription[] }) {
  return <DataTable columns={COLUMNS} rows={subscriptions} getRowId={(row) => row.id} />;
}
