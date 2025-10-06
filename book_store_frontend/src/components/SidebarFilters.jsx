import React from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../context/FilterContext.jsx';

// PUBLIC_INTERFACE
export default function SidebarFilters({ allGenres = [], allAuthors = [], onClose }) {
  /** 
   * Accessible sidebar filters: Genre and Author checklist. 
   * - Uses FilterContext to toggle selections and clear filters.
   * - onClose is used to dismiss the drawer on mobile (optional).
   */
  const {
    selectedGenres,
    selectedAuthors,
    toggleGenre,
    toggleAuthor,
    clearFilters,
  } = useFilters();

  const handleClear = () => {
    clearFilters();
    if (onClose) onClose();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
        <strong>Filters</strong>
        <button className="btn btn-ghost" onClick={handleClear} aria-label="Clear all filters">
          Clear
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <section aria-labelledby="filter-genres">
          <h3 id="filter-genres" style={{ marginBottom: '.5rem' }}>Genres</h3>
          <div style={{ display: 'grid', gap: '.375rem' }}>
            {allGenres.length === 0 && <div style={{ color: 'rgba(17,24,39,0.6)' }}>No genres</div>}
            {allGenres.map((g) => {
              const id = `genre-${g}`;
              const checked = selectedGenres?.includes(g);
              return (
                <label key={g} htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={!!checked}
                    onChange={() => toggleGenre(g)}
                  />
                  <span>{g}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="filter-authors">
          <h3 id="filter-authors" style={{ marginBottom: '.5rem' }}>Authors</h3>
          <div style={{ display: 'grid', gap: '.375rem', maxHeight: '280px', overflow: 'auto' }}>
            {allAuthors.length === 0 && <div style={{ color: 'rgba(17,24,39,0.6)' }}>No authors</div>}
            {allAuthors.map((a) => {
              const id = `author-${a}`;
              const checked = selectedAuthors?.includes(a);
              return (
                <label key={a} htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={!!checked}
                    onChange={() => toggleAuthor(a)}
                  />
                  <span>{a}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

SidebarFilters.propTypes = {
  allGenres: PropTypes.arrayOf(PropTypes.string),
  allAuthors: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
};
