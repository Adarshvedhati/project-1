import type { EditorialBoardMember } from "../types";
import styles from "./EditorialBoard.module.css";

const DEFAULT_BOARD: EditorialBoardMember[] = [
  { name: "Dr. Amara Chen", role: "Editor-in-Chief", affiliation: "Kessler Institute" },
  { name: "Dr. Farid Haddad", role: "Associate Editor", affiliation: "Linfield College" },
  { name: "Dr. Ingrid Solberg", role: "Editorial Board Member", affiliation: "Nordvik University" },
];

export function EditorialBoard({ members = DEFAULT_BOARD }: { members?: EditorialBoardMember[] }) {
  return (
    <ul className={styles.list}>
      {members.map((member) => (
        <li key={member.name} className={styles.item}>
          <p className={styles.name}>{member.name}</p>
          <p className={styles.meta}>
            {member.role} — {member.affiliation}
          </p>
        </li>
      ))}
    </ul>
  );
}
