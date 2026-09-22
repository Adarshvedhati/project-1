import type { AccessType } from "../../types";

export interface Journal {
  id: string;
  title: string;
  issn: string;
  scope: string;
  subject: string;
  accessType: AccessType;
  latestVolume: string;
}

export interface Issue {
  id: string;
  issueNo: string;
  publicationDate: string;
  articleIds: string[];
}

export interface EditorialBoardMember {
  name: string;
  role: "Editor-in-Chief" | "Associate Editor" | "Editorial Board Member";
  affiliation: string;
}
