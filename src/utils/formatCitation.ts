import { formatAuthors } from "./formatAuthors";

interface CitationSource {
  title: string;
  authors: string[];
  publicationDate: string;
  parentTitle?: string;
  doi?: string;
}

/** Minimal APA-style citation string for export/copy actions. */
export function formatCitation(item: CitationSource): string {
  const year = new Date(item.publicationDate).getFullYear();
  const parent = item.parentTitle ? ` ${item.parentTitle}.` : "";
  const doi = item.doi ? ` https://doi.org/${item.doi}` : "";
  return `${formatAuthors(item.authors)} (${year}). ${item.title}.${parent}${doi}`;
}
