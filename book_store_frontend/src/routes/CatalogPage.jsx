import React, { useEffect, useMemo, useRef, useState } from 'react';
import useBooks from '../hooks/useBooks';
import SidebarFilters from '../components/SidebarFilters.jsx';
import SortBar from '../components/SortBar.jsx';
import BookCard from '../components/BookCard.jsx';
import { useCart } from '../context/CartContext.jsx';

/**
 * CatalogPage - uses useBooks to show filtered/sorted results.
 * Keeps a stable heading "Book Catalog" used by tests.
 * Implements responsive two-column layout with sticky sidebar (desktop) and drawer (mobile).
 * Provides an aria-live region to announce cart updates.
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

  // Announcements for a11y (cart updates, etc.)
  const liveRef = useRef(null);
  const { totals } = useCart();

  const announce = (msg) => {
    if (!liveRef.current) return;
    // Clear first to ensure assistive tech re-announces same text if repeated quickly
    liveRef.current.textContent = '';
    // Use setTimeout to create a DOM change detectable by screen readers
    setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = msg;
    }, 30);
  };

  const sidebarContent = useMemo(
    () => <SidebarFilters allGenres={allGenres} allAuthors={allAuthors} onClose={closeFilters} />,
    [allGenres, allAuthors] // closeFilters stable enough for our case; not including to avoid re-mount loop
  );

  return (
    <section aria-label="Catalog section">
      <h1>Book Catalog</h1>

      {/* aria-live region for announcements (cart adds, etc.) */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden" ref={liveRef} />

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
          {!loading && !error && (
            <BookGrid
              books={books}
              onAddedToCart={(b) => announce(`${b.title} added to cart. Cart now has ${totals.count + 0} items.`)}
            />
          )}
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

function BookGrid({ books, onAddedToCart }) {
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
          <BookCard book={b} onAddedToCart={onAddedToCart} />
        </li>
      ))}
    </ul>
  );
}

// Helpers for responsive detection without external libs
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : false
  );

  React.useEffect(() => {
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
