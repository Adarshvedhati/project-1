import { useEffect, useState } from "react";
import { StatCard } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { getUsageAnalytics, listSubscriptions } from "../api/institutionsApi";
import { UsageAnalyticsChart } from "../components/UsageAnalyticsChart";
import { SubscriptionsTable } from "../components/SubscriptionsTable";
import type { InstitutionSubscription, UsagePoint } from "../types";
import styles from "./InstitutionalAccessPage.module.css";

/** SRS "For Librarians & Institutions" — usage analytics + subscription management (FR-10). */
export function InstitutionalAccessPage() {
  const [usage, setUsage] = useState<UsagePoint[]>([]);
  const [subscriptions, setSubscriptions] = useState<InstitutionSubscription[]>([]);
  useDocumentTitle("Institutional Access");

  useEffect(() => {
    getUsageAnalytics().then(setUsage);
    listSubscriptions().then(setSubscriptions);
  }, []);

  const totalDownloads = usage.reduce((sum, point) => sum + point.downloads, 0);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>For Librarians &amp; Institutions</h1>
        <p className={styles.intro}>
          Manage your institution's subscriptions and review usage across your organization.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard label="Downloads, last 5 months" value={totalDownloads} />
        <StatCard label="Active subscriptions" value={subscriptions.length} />
        <StatCard label="Seats" value="Unlimited (IP-based)" />
      </div>

      <section className={styles.section}>
        <h2>Usage over time</h2>
        <UsageAnalyticsChart data={usage} />
      </section>

      <section className={styles.section}>
        <h2>Subscriptions</h2>
        <SubscriptionsTable subscriptions={subscriptions} />
      </section>
    </div>
  );
}
