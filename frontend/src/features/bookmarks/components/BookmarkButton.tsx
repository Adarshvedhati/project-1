import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { addBookmark, listBookmarks, removeBookmark } from "../api/bookmarksApi";
import type { Bookmark } from "../types";

interface BookmarkButtonProps {
  contentId: string;
  contentType: Bookmark["contentType"];
}

/** FR-09 — save / remove an item in the signed-in user's reading list. */
export function BookmarkButton({ contentId, contentType }: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    listBookmarks()
      .then((items) => {
        const found = items.find((b) => b.contentId === contentId && b.contentType === contentType);
        if (!cancelled) setBookmarkId(found ? found.id : null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, contentId, contentType]);

  if (!isAuthenticated) return null;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      if (bookmarkId) {
        await removeBookmark(bookmarkId);
        setBookmarkId(null);
      } else {
        const created = await addBookmark(contentId, contentType);
        setBookmarkId(created.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your reading list.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={toggle} disabled={busy} aria-pressed={bookmarkId !== null}>
        {bookmarkId ? "★ Saved to reading list" : "☆ Save to reading list"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
