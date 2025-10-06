import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useBooks from '../hooks/useBooks';
import SidebarFilters from '../components/SidebarFilters.jsx';
import SortBar from '../components/SortBar.jsx';

/**
 * CatalogPage - uses useBooks to show filtered/sorted results.
 * Keeps a stable heading "Book Catalog" used by tests.
 * Implements responsive two-column layout with sticky sidebar (desktop) and drawer (mobile).
 */

// PUBLIC_INTERFACE
export default function CatalogPage() {
  /** Renders the catalog landing content wired to books hook with filters and sort. */
  const { books, allGenres, allAuthors, loading, error } = useBooks();
  const total = books?.length ?? 0;

  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => setFiltersOpen(false);

  const sidebarContent = useMemo(
    () => <SidebarFilters allGenres={allGenres} allAuthors={allAuthors} onClose={closeFilters} />,
    [allGenres, allAuthors] // closeFilters stable enough for our case; not including to avoid re-mount loop
  );

  return (
    <section aria-label="Catalog section">
      <h1>Book Catalog</h1>

      <div className="spacer" />

      {/* Sort bar with results count; shows Filters button on mobile to open drawer */}
      <SortBar total={total} onOpenFilters={isMobile ? openFilters : undefined} />

      <div className="spacer" />

      <div
        className="catalog-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        {/* Sidebar (desktop) */}
        {!isMobile && (
          <aside
            aria-label="Filters"
            className="surface"
            style={{
              position: 'sticky',
              top: '88px',
              padding: '.75rem',
              borderRadius: '12px',
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'auto',
            }}
          >
            {sidebarContent}
          </aside>
        )}

        {/* Main content */}
        <div role="main" aria-label="Main content" style={{ display: 'grid', gap: '1rem' }}>
          {loading && <p>Loading books…</p>}
          {error && <p style={{ color: 'var(--error)' }}>Failed to load books.</p>}
          {!loading && !error && <BookGrid books={books} />}
        </div>
      </div>

      {/* Drawer (mobile) */}
      {isMobile && filtersOpen && (
        <>
          <button
            className="cart-backdrop"
            aria-label="Close filters"
            onClick={closeFilters}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="surface"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100%',
              width: 'min(420px, 92vw)',
              background: 'var(--surface)',
              borderLeft: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.18)',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <header style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Filters</strong>
              <button className="btn" onClick={closeFilters} aria-label="Close filters">Close</button>
            </header>
            <div style={{ padding: '1rem 1.25rem', overflow: 'auto', flex: 1 }}>
              {sidebarContent}
            </div>
          </aside>
        </>
      )}
    </section>
  );
}

/** Simple placeholder BookCard component for grid items. */
function BookCard({ book }) {
  return (
    <article className="surface" style={{ padding: '.75rem', borderRadius: '12px', display: 'grid', gap: '.5rem' }}>
      <div style={{ aspectRatio: '3 / 4', background: 'linear-gradient(135deg, rgba(37,99,235,.12), rgba(15,23,42,.04))', borderRadius: '10px' }} aria-hidden="true" />
      <header>
        <h3 style={{ fontSize: '1rem', margin: 0 }}>{book.title}</h3>
        <div style={{ color: 'rgba(17,24,39,0.7)' }}>{book.author}</div>
      </header>
      <div style={{ fontSize: '.9rem', color: 'rgba(17,24,39,0.7)' }}>{book.genre}</div>
      <div style={{ fontWeight: 700 }}>${Number(book.price ?? 0).toFixed(2)}</div>
      <div>
        <Link to={`/book/${book.id}`} className="link">View</Link>
      </div>
    </article>
  );
}

function BookGrid({ books }) {
  if (!books?.length) {
    return <p>No books match your filters.</p>;
  }
  return (
    <ul
      aria-label="Books"
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {books.map((b) => (
        <li key={b.id}>
          <BookCard book={b} />
        </li>
      ))}
    </ul>
  );
}

// Helpers for responsive detection without external libs
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia('(max-width: 900px)').matches : false);
  useEffect(() => {
    if (!(typeof window !== 'undefined' && window.matchMedia)) return;
    const mq = window.matchMedia('(max-width: 900px)');
    const listener = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else if (mq.addListener) mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', listener);
      else if (mq.removeListener) mq.removeListener(listener);
    };
  }, []);
  return isMobile;
}
