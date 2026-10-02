import type { AccessType } from "../types";

/** Access labels per SRS section 14 ("clear access labels"). */
export const ACCESS_LABELS: Record<AccessType, string> = {
  open_access: "Open access",
  subscription: "Subscription",
  free_preview: "Free preview",
};
