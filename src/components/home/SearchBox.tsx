export function SearchBox() {
  return (
    <form className="search-box" role="search" onSubmit={(event) => event.preventDefault()}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
      </svg>
      <label className="visually-hidden" htmlFor="practice-search">חיפוש תרגול</label>
      <input id="practice-search" type="search" placeholder="חפש תרגול..." autoComplete="off" />
    </form>
  );
}
