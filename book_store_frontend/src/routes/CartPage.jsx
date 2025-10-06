import React, { useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import { formatCurrency } from '../utils/format.js';

// Shared formatter
const formatPrice = (value) => formatCurrency(value, { currency: 'USD' });

// PUBLIC_INTERFACE
export default function CartPage() {
  /**
   * Renders the cart page with:
   * - list of cart items (role=list, role=listitem)
   * - summary card: subtotal and total (same for now), and disabled Checkout CTA
   * - a "Continue shopping" link back to '/'
   * Accessibility:
   * - aria-live polite region announces changes
   * - headings and landmarks for structure
   */
  const { items, totals } = useCart();
  const liveRef = useRef(null);

  const { subtotal, total } = useMemo(() => {
    // For now, total is same as subtotal; room for tax/shipping in future
    return { subtotal: totals.subtotal, total: totals.subtotal };
  }, [totals.subtotal]);

  useEffect(() => {
    if (!liveRef.current) return;
    liveRef.current.textContent = '';
    setTimeout(() => {
      if (liveRef.current) {
        liveRef.current.textContent = `Cart has ${items.length} ${items.length === 1 ? 'item' : 'items'}, subtotal ${formatPrice(subtotal)}.`;
      }
    }, 30);
  }, [items.length, subtotal]);

  return (
    <section aria-label="Shopping cart">
      <h1>Your Cart</h1>

      {/* Live region for dynamic updates */}
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="visually-hidden" />

      <div className="spacer" />

      <div
        className="cart-layout"
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: '1fr',
        }}
      >
        <div
          role="list"
          aria-label="Cart items"
          style={{ display: 'grid', gap: '.75rem' }}
        >
          {items.length === 0 ? (
            <div className="surface" style={{ padding: '1rem', borderRadius: '12px' }}>
              <p>Your cart is empty.</p>
              <div className="spacer" />
              <Link to="/" className="btn btn-primary" aria-label="Continue shopping, go to catalog">
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((it, idx) => (
              <CartItem
                key={it.id}
                item={it}
                aria-posinset={idx + 1}
                aria-setsize={items.length}
              />
            ))
          )}
        </div>

        {/* Summary Card */}
        <aside
          aria-label="Order summary"
          className="surface"
          style={{
            padding: '1rem',
            borderRadius: '12px',
            display: 'grid',
            gap: '.5rem',
          }}
        >
          <h2 style={{ marginBottom: '.25rem', fontSize: '1.125rem' }}>Summary</h2>
          <div style={{ display: 'grid', gap: '.375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(17,24,39,0.7)' }}>
              <span>Estimated total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button
            className="btn btn-primary"
            disabled
            title="Checkout is a placeholder"
            aria-disabled="true"
            aria-label="Checkout is not available yet"
          >
            Checkout (Coming Soon)
          </button>

          <Link to="/" className="btn" aria-label="Continue shopping, go to catalog">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
