import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

// PUBLIC_INTERFACE
export default function BookCard({ book, onAddedToCart }) {
  /**
   * Single book tile displaying:
   * - cover image
   * - title, author
   * - genre chip
   * - price (local formatter)
   * - popularity indicator
   * - Add to Cart button wired to CartContext.addItem
   *
   * Accessibility:
   * - <article> with aria-labelledby pointing to the title
   * - Focus styles on interactive elements
   * - Keyboard activation handled by button natively
   * - Popularity has a textual label via title/aria-label
   */
  const { addItem } = useCart();
  const addBtnRef = useRef(null);

  // Temporary local currency formatter until utils/format.js is added
  const formatPrice = (value) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(Number(value ?? 0));
    } catch {
      const n = Number(value ?? 0);
      return `$${n.toFixed(2)}`;
    }
  };

  const titleId = `book-title-${book.id}`;
  const imgAlt = `${book.title} cover`;

  const handleAdd = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      qty: 1,
    });
    if (typeof onAddedToCart === 'function') {
      onAddedToCart(book);
    }
  };

  const popularityText = typeof book.popularity === 'number' ? `${book.popularity.toLocaleString()} wishers` : 'Popularity data not available';

  return (
    <article
      className="surface"
      style={{ padding: '.75rem', borderRadius: '12px', display: 'grid', gap: '.5rem' }}
      aria-labelledby={titleId}
    >
      <Link
        to={`/book/${book.id}`}
        style={{ display: 'block', borderRadius: '10px', overflow: 'hidden' }}
        aria-label={`View details for ${book.title}`}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={imgAlt}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              display: 'block',
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              aspectRatio: '3 / 4',
              background: 'linear-gradient(135deg, rgba(37,99,235,.12), rgba(15,23,42,.04))',
              borderRadius: '10px',
            }}
            aria-hidden="true"
          />
        )}
      </Link>

      <header>
        <h3 id={titleId} style={{ fontSize: '1rem', margin: 0 }}>
          {book.title}
        </h3>
        <div style={{ color: 'rgba(17,24,39,0.7)' }}>{book.author}</div>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
        {book.genre && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '.2rem .5rem',
              borderRadius: '999px',
              background: 'rgba(37,99,235,0.08)',
              color: 'var(--text)',
              fontSize: '.75rem',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
            aria-label={`Genre: ${book.genre}`}
          >
            {book.genre}
          </span>
        )}

        {typeof book.popularity === 'number' && (
          <span
            title={popularityText}
            aria-label={`Popularity: ${popularityText}`}
            style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'rgba(17,24,39,0.7)' }}
          >
            🔥 {book.popularity.toLocaleString()}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
        <strong style={{ fontWeight: 800 }}>{formatPrice(book.price)}</strong>
        <button
          ref={addBtnRef}
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
          aria-label={`Add ${book.title} to cart for ${formatPrice(book.price)}`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    genre: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    popularity: PropTypes.number,
    description: PropTypes.string,
    cover: PropTypes.string,
  }).isRequired,
  onAddedToCart: PropTypes.func,
};
