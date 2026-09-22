import styles from "./FacetFilters.module.css";

export interface FacetGroup {
  key: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

interface FacetFiltersProps {
  groups: FacetGroup[];
  selected: Record<string, string[]>;
  onToggle: (groupKey: string, value: string) => void;
  onClear?: () => void;
}

/** Faceted filtering by content type, subject, date, access type etc. (SRS 10). */
export function FacetFilters({ groups, selected, onToggle, onClear }: FacetFiltersProps) {
  const hasSelection = Object.values(selected).some((values) => values.length > 0);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Refine results</h3>
        {hasSelection && onClear && (
          <button type="button" className={styles.clear} onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
      {groups.map((group) => (
        <fieldset key={group.key} className={styles.group}>
          <legend className={styles.groupLabel}>{group.label}</legend>
          {group.options.map((option) => {
            const checked = selected[group.key]?.includes(option.value) ?? false;
            return (
              <label key={option.value} className={styles.option}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(group.key, option.value)}
                />
                <span>{option.label}</span>
                {typeof option.count === "number" && <span className={styles.count}>{option.count}</span>}
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
