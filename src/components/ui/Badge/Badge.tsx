import type { ReactNode } from "react";
import type { AccessType } from "../../../types";
import { ACCESS_LABELS } from "../../../constants/accessTypes";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  tone?: "navy" | "ochre" | "slate" | "oxblood";
}

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

const ACCESS_TONE: Record<AccessType, BadgeProps["tone"]> = {
  open_access: "ochre",
  subscription: "slate",
  free_preview: "navy",
};

/** Renders one of the three access labels required by SRS section 14. */
export function AccessBadge({ accessType }: { accessType: AccessType }) {
  return <Badge tone={ACCESS_TONE[accessType]}>{ACCESS_LABELS[accessType]}</Badge>;
}
