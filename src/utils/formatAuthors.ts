/** "A. Smith, B. Lee & C. Ortiz" — the standard scholarly author-list join. */
export function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")} & ${authors[authors.length - 1]}`;
}
