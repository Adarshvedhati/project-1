import { useState, type FormEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  size?: "md" | "lg";
}

export function SearchBar({ initialQuery = "", placeholder, onSearch, size = "md" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form className={`${styles.form} ${styles[size]}`} onSubmit={handleSubmit} role="search">
      <label htmlFor="global-search" className="visually-hidden">
        Search journals, articles, books and case studies
      </label>
      <input
        id="global-search"
        type="search"
        className={styles.input}
        placeholder={placeholder ?? "Search articles, journals, books, authors…"}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" className={styles.submit}>
        Search
      </button>
    </form>
  );
}
