import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { listJournals } from "../../journals/api/journalsApi";
import { createSubmission } from "../api/submissionsApi";
import type { JournalSummary } from "../../../mocks/journals.mock";
import type { SubmissionDraft } from "../types";
import styles from "./NewSubmissionPage.module.css";

const EMPTY_DRAFT: SubmissionDraft = {
  title: "",
  abstract: "",
  contentType: "article",
  authorNames: "",
};

/** SRS section 13 "Submission Form" — the author-facing intake for FR-06. */
export function NewSubmissionPage() {
  const [draft, setDraft] = useState<SubmissionDraft>(EMPTY_DRAFT);
  const [journals, setJournals] = useState<JournalSummary[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("New Submission");

  useEffect(() => {
    listJournals().then(setJournals);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    await createSubmission(draft);
    setSubmitting(false);
    navigate("/publish/submissions");
  }

  return (
    <div>
      <h1>New submission</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Content type</span>
          <select
            value={draft.contentType}
            onChange={(e) =>
              setDraft((d) => ({ ...d, contentType: e.target.value as SubmissionDraft["contentType"] }))
            }
          >
            <option value="article">Journal article</option>
            <option value="book_proposal">Book proposal</option>
            <option value="case_study">Case study</option>
          </select>
        </label>

        {draft.contentType === "article" && (
          <label className={styles.field}>
            <span>Target journal</span>
            <select
              value={draft.targetJournalId ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, targetJournalId: e.target.value }))}
              required
            >
              <option value="" disabled>
                Select a journal
              </option>
              {journals.map((journal) => (
                <option key={journal.id} value={journal.id}>
                  {journal.title}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={styles.field}>
          <span>Title</span>
          <input
            type="text"
            required
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Author names</span>
          <input
            type="text"
            required
            placeholder="e.g. A. Smith, B. Lee"
            value={draft.authorNames}
            onChange={(e) => setDraft((d) => ({ ...d, authorNames: e.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Abstract</span>
          <textarea
            required
            rows={6}
            value={draft.abstract}
            onChange={(e) => setDraft((d) => ({ ...d, abstract: e.target.value }))}
          />
        </label>

        <div className={styles.actions}>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit manuscript"}
          </Button>
        </div>
      </form>
    </div>
  );
}
