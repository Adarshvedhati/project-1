import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AccessBadge, LinkButton, Tabs, type TabItem } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { getJournal, getJournalArticles } from "../api/journalsApi";
import { EditorialBoard } from "../components/EditorialBoard";
import { IssueList } from "../components/IssueList";
import type { JournalSummary } from "../../../mocks/journals.mock";
import type { SearchResultItem } from "../../../types";
import styles from "./JournalDetailPage.module.css";

const TABS: TabItem[] = [
  { key: "latest", label: "Latest issue" },
  { key: "board", label: "Editorial board" },
  { key: "guidelines", label: "Author guidelines" },
];

/** SRS section 13 "Journal Page": title, ISSN, scope, latest issue, editors, submission CTA. */
export function JournalDetailPage() {
  const { journalId = "" } = useParams();
  const [journal, setJournal] = useState<JournalSummary | undefined>();
  const [articles, setArticles] = useState<SearchResultItem[]>([]);
  const [activeTab, setActiveTab] = useState("latest");

  useDocumentTitle(journal?.title ?? "Journal");

  useEffect(() => {
    getJournal(journalId).then(setJournal);
    getJournalArticles(journalId).then(setArticles);
  }, [journalId]);

  if (!journal) {
    return <div className="container">Loading journal…</div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <AccessBadge accessType={journal.accessType} />
          <span className={styles.issn}>ISSN {journal.issn}</span>
        </div>
        <h1>{journal.title}</h1>
        <p className={styles.scope}>{journal.scope}</p>
        <div className={styles.ctaRow}>
          <LinkButton to="/publish/submissions/new">Submit to this journal</LinkButton>
          <Link to={`/search?q=${encodeURIComponent(journal.title)}`} className={styles.secondaryLink}>
            View all articles
          </Link>
        </div>
      </header>

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      <div className={styles.tabPanel}>
        {activeTab === "latest" && (
          <>
            <p className={styles.volumeLabel}>{journal.latestVolume}</p>
            <IssueList articles={articles} />
          </>
        )}
        {activeTab === "board" && <EditorialBoard />}
        {activeTab === "guidelines" && (
          <div className={styles.guidelines}>
            <p>
              Manuscripts should be submitted through the online system as a single Word or PDF
              file, formatted to the journal's reference style. Full guidance is provided during
              submission.
            </p>
            <Link to="/publish" className={styles.secondaryLink}>
              Read the full author guidelines
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
