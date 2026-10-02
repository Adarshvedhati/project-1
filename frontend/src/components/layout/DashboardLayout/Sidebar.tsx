import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export interface SidebarLink {
  label: string;
  path: string;
  end?: boolean;
}

export function Sidebar({ title, links }: { title: string; links: SidebarLink[] }) {
  return (
    <aside className={styles.sidebar}>
      <p className={styles.title}>{title}</p>
      <nav aria-label={title}>
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.end}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
