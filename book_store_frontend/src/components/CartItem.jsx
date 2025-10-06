import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/format.js';

// Use shared formatter
const formatPrice = (value) => formatCurrency(value, { currency: 'USD' });

// PUBLIC_INTERFACE
export default function CartItem({ item, 'aria-posinset': posinset, 'aria-setsize': setsize }) {
  /** 
   * Render a single cart item row with:
   * - title (heading)
   * - price x qty with extended line total
   * - quantity controls: decrement/increment buttons and number input
   * - remove button
   * Accessibility:
   * - Wrapper li is expected; this component focuses on internal controls and labels
   * - Buttons have aria-labels with item title context
   */
  const { increment, decrement, setQty, removeItem } = useCart();

  const lineTotal = useMemo(() => {
    const p = Number(item.price || 0);
    const q = Number(item.qty || 0);
    return Number((p * q).toFixed(2));
  }, [item.price, item.qty]);

  const onDec = () => {
    decrement(item.id);
  };
  const onInc = () => {
    increment(item.id);
  };
  const onRemove = () => {
    removeItem(item.id);
  };
  const onQtyChange = (e) => {
    const val = e.target.value;
    const n = Number(val);
    if (Number.isNaN(n)) return;
    // Allow 0 to trigger removal as per context behavior
    setQty(item.id, Math.max(0, Math.floor(n)));
  };

  const qtyId = `qty-${item.id}`;

  return (
    <div
      className="cart-item surface"
      role="listitem"
      aria-posinset={posinset}
      aria-setsize={setsize}
      style={{
        padding: '.75rem',
        borderRadius: '12px',
        display: 'grid',
        gap: '.5rem',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'grid', gap: '.375rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{item.title}</h3>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}
          aria-label={`Unit price ${formatPrice(item.price)}. Quantity ${item.qty}. Line total ${formatPrice(lineTotal)}.`}
        >
          <span style={{ color: 'rgba(17,24,39,0.7)' }}>{formatPrice(item.price)} each</span>
          <span aria-hidden="true" style={{ color: 'rgba(17,24,39,0.5)' }}>•</span>
          <strong>{formatPrice(lineTotal)}</strong>
        </div>

        {/* Quantity controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <button
            type="button"
            className="btn"
            aria-label={`Decrease quantity for ${item.title}`}
            onClick={onDec}
          >
            −
          </button>
          <label htmlFor={qtyId} className="visually-hidden">Quantity for {item.title}</label>
          <input
            id={qtyId}
            type="number"
            min="0"
            inputMode="numeric"
            value={item.qty}
            onChange={onQtyChange}
            aria-label={`Quantity for ${item.title}`}
            style={{
              width: '4.5rem',
              padding: '.4rem .5rem',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'var(--surface)',
              color: 'var(--text)',
              textAlign: 'center',
            }}
          />
          <button
            type="button"
            className="btn"
            aria-label={`Increase quantity for ${item.title}`}
            onClick={onInc}
          >
            +
          </button>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onRemove}
            aria-label={`Remove ${item.title} from cart`}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price on right for larger screens */}
      <div style={{ fontWeight: 800, whiteSpace: 'nowrap' }} aria-hidden="true">
        {formatPrice(lineTotal)}
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number,
    qty: PropTypes.number,
  }).isRequired,
  'aria-posinset': PropTypes.number,
  'aria-setsize': PropTypes.number,
};
