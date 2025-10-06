/**
 * CatalogPage - temporary stub content to avoid build breaks.
 * Contains a stable heading "Book Catalog" used by tests.
 */
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CatalogPage() {
  /** Renders the catalog landing content. */
  return (
    <section className="surface" style={{ padding: '1rem' }}>
      <h1>Book Catalog</h1>
      <p>Browse our curated selection of books. Use filters, sorters, and add to cart.</p>
      <div className="spacer" />
      <Link to="/book/placeholder" className="link">View a sample book</Link>
    </section>
  );
}
