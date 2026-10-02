import type { UsagePoint } from "../types";
import styles from "./UsageAnalyticsChart.module.css";

/** Simple dependency-free bar chart for institutional usage (FR-10). */
export function UsageAnalyticsChart({ data }: { data: UsagePoint[] }) {
  const max = Math.max(...data.map((point) => point.downloads), 1);

  return (
    <div className={styles.chart}>
      {data.map((point) => (
        <div key={point.month} className={styles.column}>
          <div
            className={styles.bar}
            style={{ height: `${(point.downloads / max) * 100}%` }}
            title={`${point.downloads} downloads`}
          />
          <span className={styles.label}>{point.month}</span>
        </div>
      ))}
    </div>
  );
}
