export interface Bookmark {
  id: string;
  contentId: string;
  contentType: "article" | "journal" | "book" | "case_study";
  title: string;
  savedAt: string;
}
