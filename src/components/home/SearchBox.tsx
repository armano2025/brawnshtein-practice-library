import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SearchCatalog, SearchResultType } from "../../models/Search";
import { catalogService } from "../../services/catalogService";
import { getSearchHighlightSegments, searchCatalog } from "../../utils/searchCatalog";

const resultTypeLabels: Record<SearchResultType, string> = {
  subject: "מקצוע",
  grade: "כיתה או מסלול",
  topic: "נושא",
  worksheet: "תרגול",
};

interface HighlightedTextProps {
  text: string;
  query: string;
}

function HighlightedText({ text, query }: HighlightedTextProps) {
  return getSearchHighlightSegments(text, query).map((segment, index) => (
    segment.isMatch ? (
      <mark className="search-highlight" key={`${segment.text}-${index}`}>{segment.text}</mark>
    ) : segment.text
  ));
}

export function SearchBox() {
  const navigate = useNavigate();
  const blurTimer = useRef<number>();
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchCatalog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => catalog ? searchCatalog(catalog, query) : [], [catalog, query]);
  const hasQuery = query.trim().length > 0;

  useEffect(() => () => window.clearTimeout(blurTimer.current), []);

  const loadCatalog = async () => {
    if (catalog || isLoading) return;
    setIsLoading(true);
    setError(false);

    try {
      setCatalog(await catalogService.getSearchCatalog());
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    if (value.trim()) void loadCatalog();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (results[0]) navigate(results[0].path);
  };

  return (
    <form
      className="search-box"
      role="search"
      onSubmit={handleSubmit}
      onFocus={() => {
        window.clearTimeout(blurTimer.current);
        if (hasQuery) setIsOpen(true);
      }}
      onBlur={() => {
        blurTimer.current = window.setTimeout(() => setIsOpen(false), 120);
      }}
    >
      <div className="search-input-wrapper">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>
        <label className="visually-hidden" htmlFor="practice-search">חיפוש תרגול</label>
        <input
          id="practice-search"
          type="search"
          placeholder="חפש תרגול..."
          autoComplete="off"
          value={query}
          aria-controls="practice-search-results"
          aria-expanded={isOpen && hasQuery}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        />
      </div>

      {isOpen && hasQuery ? (
        <div id="practice-search-results" className="search-results" aria-live="polite">
          {isLoading ? (
            <p className="search-status">מחפשים במאגר...</p>
          ) : error ? (
            <p className="search-status search-status-error">לא הצלחנו לטעון את החיפוש. נסו שוב בעוד רגע.</p>
          ) : results.length ? (
            <>
              <p className="search-results-summary">נמצאו {results.length} תוצאות</p>
              <ul>
                {results.map((result) => (
                  <li key={`${result.type}-${result.id}`}>
                    <Link to={result.path} onClick={() => setIsOpen(false)}>
                      <span className="search-result-type">{resultTypeLabels[result.type]}</span>
                      <span className="search-result-content">
                        <strong><HighlightedText text={result.title} query={query} /></strong>
                        <small><HighlightedText text={result.description} query={query} /></small>
                      </span>
                      <span className="search-result-arrow" aria-hidden="true">←</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : catalog ? (
            <p className="search-status">לא נמצאו תוצאות לחיפוש הזה</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
