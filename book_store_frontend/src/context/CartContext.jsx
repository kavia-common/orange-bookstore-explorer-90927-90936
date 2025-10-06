import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

/**
 * Cart item shape
 * id: string | number
 * title: string
 * price: number (in currency units, e.g., 12.99)
 * qty: number
 */

// Internal keys
const CART_STORAGE_KEY = 'obse.cart.v1';

// PUBLIC_INTERFACE
export const CartContext = createContext({
  /** Array of items in the cart */
  items: [],
  /** Derived totals */
  totals: { count: 0, subtotal: 0 },
  /** Add a new item to the cart or increase qty if it already exists */
  addItem: () => {},
  /** Remove an item completely from the cart by id */
  removeItem: () => {},
  /** Increase item quantity by 1 */
  increment: () => {},
  /** Decrease item quantity by 1 (min 1; if reaches 0, remove) */
  decrement: () => {},
  /** Set item quantity to a specific value (min 1; if reaches 0, remove) */
  setQty: () => {},
  /** Clear all items from the cart */
  clear: () => {},
});

/**
 * Reducer actions
 */
const ACTIONS = {
  INIT: 'INIT',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  INC: 'INC',
  DEC: 'DEC',
  SET_QTY: 'SET_QTY',
  CLEAR: 'CLEAR',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return Array.isArray(action.payload) ? action.payload : [];
    case ACTIONS.ADD: {
      const item = action.payload;
      const existing = state.find((i) => i.id === item.id);
      if (existing) {
        return state.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty || 1) + (item.qty || 1) } : i
        );
      }
      return [...state, { ...item, qty: item.qty || 1 }];
    }
    case ACTIONS.REMOVE:
      return state.filter((i) => i.id !== action.payload);
    case ACTIONS.INC:
      return state.map((i) => (i.id === action.payload ? { ...i, qty: (i.qty || 1) + 1 } : i));
    case ACTIONS.DEC:
      return state
        .map((i) => (i.id === action.payload ? { ...i, qty: Math.max((i.qty || 1) - 1, 0) } : i))
        .filter((i) => i.qty > 0);
    case ACTIONS.SET_QTY: {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        return state.filter((i) => i.id !== id);
      }
      return state.map((i) => (i.id === id ? { ...i, qty } : i));
    }
    case ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}

function usePersistedCart() {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: ACTIONS.INIT, payload: parsed });
        }
      }
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures
    }
  }, [items]);

  return [items, dispatch];
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /**
   * Provides cart state and actions to children.
   * Values:
   * - items: array of cart items
   * - totals: { count, subtotal }
   * - actions: addItem, removeItem, increment, decrement, setQty, clear
   */
  const [items, dispatch] = usePersistedCart();

  const totals = useMemo(() => {
    const count = items.reduce((acc, i) => acc + (i.qty || 0), 0);
    const subtotal = items.reduce((acc, i) => acc + (i.price || 0) * (i.qty || 0), 0);
    return { count, subtotal: Number(subtotal.toFixed(2)) };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem: (item) => dispatch({ type: ACTIONS.ADD, payload: item }),
      removeItem: (id) => dispatch({ type: ACTIONS.REMOVE, payload: id }),
      increment: (id) => dispatch({ type: ACTIONS.INC, payload: id }),
      decrement: (id) => dispatch({ type: ACTIONS.DEC, payload: id }),
      setQty: (id, qty) => dispatch({ type: ACTIONS.SET_QTY, payload: { id, qty } }),
      clear: () => dispatch({ type: ACTIONS.CLEAR }),
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node,
};

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart context safely. */
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
