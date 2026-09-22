import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
}

/** Small dashboard metric card (analytics, admin, editorial queues). */
export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {trend && <p className={styles.trend}>{trend}</p>}
    </div>
  );
}
