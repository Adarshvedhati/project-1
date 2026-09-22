import { Link } from "react-router-dom";
import type { NavMegaColumn } from "../../../constants/navigation";
import styles from "./MegaMenu.module.css";

export function MegaMenu({ columns }: { columns: NavMegaColumn[] }) {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {columns.map((column) => (
          <div key={column.heading}>
            <p className={styles.columnHeading}>{column.heading}</p>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
