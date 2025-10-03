import React from "react";

// PUBLIC_INTERFACE
export default function FiltersSidebar({
  genres = [],
  authors = [],
  selectedGenres = new Set(),
  selectedAuthors = new Set(),
  onToggleGenre,
  onToggleAuthor,
  onClear,
}) {
  return (
    <aside className="sidebar">
      <h3>Filters</h3>
      <div className="filter-group">
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <strong>Genres</strong>
          <button className="btn btn-ghost" onClick={onClear} aria-label="Clear filters">Clear</button>
        </div>
        <div>
          {genres.map(g => (
            <label key={g} className="checkbox">
              <input
                type="checkbox"
                checked={selectedGenres.has(g)}
                onChange={()=>onToggleGenre(g)}
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <strong>Authors</strong>
        <div style={{ marginTop: 6 }}>
          <select
            className="select"
            value={[...selectedAuthors][0] || ""}
            onChange={(e)=>onToggleAuthor(e.target.value)}
          >
            <option value="">All authors</option>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
    </aside>
  );
}
