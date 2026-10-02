import { formatDate } from "../../../utils/formatDate";
import { EmptyState } from "../../../components/ui";
import type { AlertItem } from "../types";
import styles from "./AlertsList.module.css";

export function AlertsList({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) {
    return <EmptyState title="No alerts yet" description="Save a search to get notified when new matching content is published." />;
  }

  return (
    <ul className={styles.list}>
      {alerts.map((alert) => (
        <li key={alert.id} className={`${styles.item} ${alert.read ? "" : styles.unread}`}>
          <p>{alert.message}</p>
          <span className={styles.date}>{formatDate(alert.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
