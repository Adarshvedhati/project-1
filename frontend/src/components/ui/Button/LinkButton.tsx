import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import styles from "./Button.module.css";

interface LinkButtonProps extends LinkProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
}

/** Link styled as a Button — for CTAs that navigate rather than submit. */
export function LinkButton({ variant = "primary", size = "md", className, children, ...rest }: LinkButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
  return (
    <Link className={classes} {...rest}>
      {children}
    </Link>
  );
}
