export interface UsagePoint {
  month: string;
  downloads: number;
}

export interface InstitutionSubscription {
  id: string;
  journalTitle: string;
  plan: "full-text" | "abstract-only";
  renewalDate: string;
}
