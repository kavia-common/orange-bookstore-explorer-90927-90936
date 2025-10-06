/**
 * CatalogPage - uses useBooks to show filtered/sorted results.
 * Keeps a stable heading "Book Catalog" used by tests.
 */
import { Link } from 'react-router-dom';
import useBooks from '../hooks/useBooks';

function BookList({ books }) {
  if (!books?.length) {
    return <p>No books match your filters.</p>;
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
      {books.map((b) => (
        <li key={b.id} className="surface" style={{ padding: '.75rem', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gap: '.5rem' }}>
            <strong>{b.title}</strong>
            <div style={{ color: 'rgba(17,24,39,0.7)' }}>{b.author}</div>
            <div style={{ fontSize: '.9rem', color: 'rgba(17,24,39,0.7)' }}>{b.genre}</div>
            <div style={{ fontWeight: 700 }}>${Number(b.price ?? 0).toFixed(2)}</div>
            <Link to={`/book/${b.id}`} className="link">View</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

// PUBLIC_INTERFACE
export default function CatalogPage() {
  /** Renders the catalog landing content wired to books hook. */
  const { books, allGenres, allAuthors, loading, error } = useBooks();

  return (
    <section className="surface" style={{ padding: '1rem' }}>
      <h1>Book Catalog</h1>

      <p>Browse our curated selection of books. Use filters, sorters, and add to cart.</p>

      <div className="spacer" />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
        <div style={{ fontSize: '.9rem' }}>
          <strong>Genres:</strong> {allGenres.join(', ') || '—'}
        </div>
        <div style={{ fontSize: '.9rem' }}>
          <strong>Authors:</strong> {allAuthors.join(', ') || '—'}
        </div>
      </div>

      {loading && <p>Loading books…</p>}
      {error && <p style={{ color: 'var(--error)' }}>Failed to load books.</p>}
      {!loading && !error && <BookList books={books} />}

      <div className="spacer" />
      <Link to="/book/placeholder" className="link">View a sample book</Link>
    </section>
  );
}
