import React, { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { item } = action;
      const existing = state.items[item.id];
      const qty = existing ? existing.quantity + 1 : 1;
      const items = {
        ...state.items,
        [item.id]: { ...item, quantity: qty }
      };
      return { ...state, items };
    }
    case "REMOVE": {
      const items = { ...state.items };
      delete items[action.id];
      return { ...state, items };
    }
    case "SET_QTY": {
      const { id, quantity } = action;
      if (quantity <= 0) {
        const items = { ...state.items };
        delete items[id];
        return { ...state, items };
      }
      const current = state.items[id];
      if (!current) return state;
      return { ...state, items: { ...state.items, [id]: { ...current, quantity } } };
    }
    case "CLEAR":
      return { items: {} };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: {} });

  const api = useMemo(() => ({
    items: state.items,
    add: (item) => dispatch({ type: "ADD", item }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    setQty: (id, quantity) => dispatch({ type: "SET_QTY", id, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
    totalItems: Object.values(state.items).reduce((s, i) => s + i.quantity, 0),
    totalPrice: Object.values(state.items).reduce((s, i) => s + i.quantity * i.price, 0),
  }), [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
