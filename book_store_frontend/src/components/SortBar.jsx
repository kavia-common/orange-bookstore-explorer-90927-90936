import React from 'react';
import { useFilters } from '../context/FilterContext.jsx';

// PUBLIC_INTERFACE
export default function SortBar({ total = 0, onOpenFilters }) {
  /**
   * Sort bar with sort dropdown and optional "Filters" button on mobile.
   * - onOpenFilters opens the drawer on small screens.
   */
  const { sort, setSort } = useFilters();

  return (
    <div className="surface" style={{ padding: '.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
      <div aria-live="polite">
        <strong>{total}</strong> results
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        {typeof onOpenFilters === 'function' && (
          <button className="btn" onClick={onOpenFilters} aria-label="Open filters">
            Filters
          </button>
        )}
        <label htmlFor="sort" className="visually-hidden">Sort by</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: '.5rem .75rem',
            borderRadius: '10px',
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
          aria-label="Sort books"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
    </div>
  );
}
