import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Sidebar, type SidebarLink } from "./Sidebar";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  title: string;
  links: SidebarLink[];
}

/**
 * Shell for the role dashboards — Submission, Reviewer, Editor and Admin
 * (SRS section 13). Keeps the public header/footer for wayfinding, adds
 * a role-scoped sidebar around the routed page content.
 */
export function DashboardLayout({ title, links }: DashboardLayoutProps) {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={`container ${styles.body}`}>
        <Sidebar title={title} links={links} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
