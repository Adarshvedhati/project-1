import { useState } from "react";
import type { ArticleDetail } from "../../../mocks/articles.mock";
import { formatCitation } from "../../../utils/formatCitation";
import styles from "./CitationExport.module.css";

/** Citation/export tools from the article structure (section 4.4). */
export function CitationExport({ article }: { article: ArticleDetail }) {
  const [copied, setCopied] = useState(false);
  const citation = formatCitation(article);

  async function handleCopy() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.box}>
      <p className={styles.label}>Cite this article</p>
      <p className={styles.citation}>{citation}</p>
      <button type="button" className={styles.copyButton} onClick={handleCopy}>
        {copied ? "Copied" : "Copy citation"}
      </button>
    </div>
  );
}
