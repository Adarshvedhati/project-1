import type { ReactNode } from "react";
import styles from "./DataTable.module.css";
import { EmptyState } from "../EmptyState/EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Generic table used across submission, reviewer, editor and admin dashboards. */
export function DataTable<T>({ columns, rows, getRowId, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "Nothing here yet"}
        description={emptyDescription ?? "New items will appear in this list once they exist."}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
