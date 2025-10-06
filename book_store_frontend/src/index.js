import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

/**
 * TODO: Replace these stub providers with real contexts in step 1.05.
 * These are temporary pass-through providers to avoid import errors
 * until CartContext and FilterContext are implemented.
 */

// PUBLIC_INTERFACE
export const CartContext = createContext({});

// PUBLIC_INTERFACE
export const FilterContext = createContext({});

// Temporary pass-through providers that simply render children.
// Replace with actual providers that manage state and actions later.
function CartProvider({ children }) {
  /** Temporary provider: passes through children without state. */
  return <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
}

function FilterProvider({ children }) {
  /** Temporary provider: passes through children without state. */
  return <FilterContext.Provider value={{}}>{children}</FilterContext.Provider>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
