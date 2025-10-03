import React from "react";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function Header({ onOpenCart, query, setQuery }) {
  const cart = useCart();

  return (
    <header className="header">
      <div className="header-inner container" style={{paddingLeft:0,paddingRight:0}}>
        <div className="brand">
          <div className="brand-badge">OB</div>
          <div className="brand-title">Ocean Bookstore</div>
        </div>
        <div className="searchbar">
          <input
            className="input"
            placeholder="Search books by title..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            aria-label="Search books"
          />
          <button className="btn btn-primary" onClick={()=>{/* no-op; live search */}}>
            Search
          </button>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" aria-label="Help">Help</button>
          <button className="btn btn-primary" onClick={onOpenCart} aria-label="Open cart">
            Cart • {cart.totalItems}
          </button>
        </div>
      </div>
    </header>
  );
}
