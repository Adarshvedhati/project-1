import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentCard, FacetFilters, Pagination, SearchBar, type FacetGroup } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { search } from "../api/searchApi";
import { SEARCH_CONTENT_TYPES } from "../types";
import type { SearchResultItem } from "../../../types";
import styles from "./SearchResultsPage.module.css";

const FACET_GROUPS: FacetGroup[] = [
  {
    key: "contentType",
    label: "Content type",
    options: SEARCH_CONTENT_TYPES.map((type) => ({ value: type.key, label: type.label })),
  },
  {
    key: "accessType",
    label: "Access",
    options: [
      { value: "open_access", label: "Open access" },
      { value: "subscription", label: "Subscription" },
      { value: "free_preview", label: "Free preview" },
    ],
  },
];

/** SRS section 13 "Search Results" screen: search field, filters, tabs, cards, pagination. */
export function SearchResultsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1");

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useDocumentTitle(query ? `Search: ${query}` : "Search");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    search(query, page).then((response) => {
      if (cancelled) return;
      let items = response.items;
      if (selected.contentType?.length) {
        items = items.filter((item) => selected.contentType.includes(item.contentType));
      }
      if (selected.accessType?.length) {
        items = items.filter((item) => selected.accessType.includes(item.accessType));
      }
      setResults(items);
      setTotal(response.total);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query, page, selected]);

  function toggleFacet(groupKey: string, value: string) {
    setSelected((prev) => {
      const current = prev[groupKey] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [groupKey]: next };
    });
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.searchRow}>
        <SearchBar
          initialQuery={query}
          size="lg"
          onSearch={(next) => setParams({ q: next, page: "1" })}
        />
      </div>

      <div className={styles.layout}>
        <FacetFilters
          groups={FACET_GROUPS}
          selected={selected}
          onToggle={toggleFacet}
          onClear={() => setSelected({})}
        />

        <div>
          <p className={styles.resultCount}>
            {loading ? "Searching…" : `${total} result${total === 1 ? "" : "s"}${query ? ` for "${query}"` : ""}`}
          </p>

          <div>
            {results.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={10}
            total={total}
            onPageChange={(next) => setParams({ q: query, page: String(next) })}
          />
        </div>
      </div>
    </div>
  );
}
