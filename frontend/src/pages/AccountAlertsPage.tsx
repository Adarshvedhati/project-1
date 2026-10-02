import { useEffect, useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { listAlerts } from "../features/notifications/api/notificationsApi";
import { AlertsList } from "../features/notifications/components/AlertsList";
import type { AlertItem } from "../features/notifications/types";
import styles from "./AccountPages.module.css";

/** SRS FR-09 — saved-search alert history. */
export function AccountAlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  useDocumentTitle("Saved Search Alerts");

  useEffect(() => {
    listAlerts().then(setAlerts);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <h1>Saved search alerts</h1>
      <div className={styles.body}>
        <AlertsList alerts={alerts} />
      </div>
    </div>
  );
}
