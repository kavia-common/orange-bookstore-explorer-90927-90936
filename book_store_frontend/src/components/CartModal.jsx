import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../context/CartContext.jsx';
import { trapFocus, setAriaHiddenOutside, announceLiveMessage } from '../utils/accessibility.js';

/**
 * Format price utility (USD fallback).
 */
function formatPrice(value) {
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
}

// PUBLIC_INTERFACE
export default function CartModal({ isOpen, onClose, onGoToCart }) {
  /**
   * Accessible Cart modal:
   * - role="dialog" aria-modal="true"
   * - labelled by heading with id
   * - focus trap while open and restoration on close
   * - close by ESC and by clicking on backdrop
   * - aria-live polite region announces state changes
   * - lists items from CartContext and shows subtotal
   */
  const { items, totals } = useCart();

  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const liveRef = useRef(null);
  const headingId = 'cart-modal-title';

  // focus trap and background aria-hidden
  useEffect(() => {
    if (!isOpen) return;
    const cleanupTrap = trapFocus(dialogRef.current, closeBtnRef.current);
    const cleanupAriaHidden = setAriaHiddenOutside(dialogRef.current, true);

    return () => {
      cleanupTrap && cleanupTrap();
      cleanupAriaHidden && cleanupAriaHidden();
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [isOpen, onClose]);

  // Announce when opened
  useEffect(() => {
    if (isOpen && liveRef.current) {
      announceLiveMessage(
        liveRef.current,
        `Cart opened. ${totals.count} items, subtotal ${formatPrice(totals.subtotal)}.`
      );
    }
  }, [isOpen, totals]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleGoToCart = () => {
    onGoToCart?.();
  };

  return (
    <>
      <button
        className="cart-backdrop"
        aria-label="Close cart"
        onClick={handleBackdropClick}
      />
      <aside
        ref={dialogRef}
        className="cart-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <header>
          <strong id={headingId}>Cart</strong>
          <button
            ref={closeBtnRef}
            className="btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            Close
          </button>
        </header>

        {/* Live region for announcements */}
        <div ref={liveRef} aria-live="polite" aria-atomic="true" className="visually-hidden" />

        <div className="content">
          {items.length === 0 ? (
            <p>Your cart is currently empty.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '.5rem' }}>
              {items.map((it) => (
                <li
                  key={it.id}
                  className="surface"
                  style={{
                    padding: '.5rem .75rem',
                    borderRadius: '10px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '.5rem',
                  }}
                  aria-label={`${it.title}, quantity ${it.qty}, price ${formatPrice(it.price)}`}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div style={{ fontSize: '.875rem', color: 'rgba(17,24,39,0.7)' }}>
                      Qty: {it.qty}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatPrice((it.price || 0) * (it.qty || 0))}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <strong>{formatPrice(totals.subtotal)}</strong>
          </div>
          <button className="btn btn-primary" onClick={handleGoToCart} aria-label="Go to cart page to review items">
            Go to Cart
          </button>
          <button className="btn" onClick={onClose}>
            Continue Shopping
          </button>
        </footer>
      </aside>
    </>
  );
}

CartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoToCart: PropTypes.func,
};
