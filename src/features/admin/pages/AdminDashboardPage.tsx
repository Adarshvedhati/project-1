import { useEffect, useState } from "react";
import { StatCard, Tabs, type TabItem } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listAuditLog, listUsers } from "../api/adminApi";
import { UsersTable } from "../components/UsersTable";
import { AuditLogTable } from "../components/AuditLogTable";
import type { AdminUserRow, AuditLogEntry } from "../types";
import styles from "./AdminDashboardPage.module.css";

const TABS: TabItem[] = [
  { key: "users", label: "Users & roles" },
  { key: "audit", label: "Audit log" },
];

/** SRS section 13 "Admin Dashboard" — user/role management, content moderation, audit trail (FR-11). */
export function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  useDocumentTitle("Admin Dashboard");

  useEffect(() => {
    listUsers().then(setUsers);
    listAuditLog().then(setAuditLog);
  }, []);

  return (
    <div>
      <h1>Admin dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Pending invitations" value={users.filter((u) => u.status === "invited").length} />
        <StatCard label="Content items" value="1,248" />
      </div>

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      <div className={styles.tabPanel}>
        {activeTab === "users" && <UsersTable users={users} />}
        {activeTab === "audit" && <AuditLogTable entries={auditLog} />}
      </div>
    </div>
  );
}
