import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import './styles/components.css';

import Header from './components/Header';
import Footer from './components/Footer';
import CatalogPage from './routes/CatalogPage';
import CartPage from './routes/CartPage';

// PUBLIC_INTERFACE
function App() {
  /**
   * App shell with theme management, header/footer, and routing.
   * - Routes: '/', '/cart', '/book/:id' (placeholder)
   * - Cart quick-view modal managed at App level (open/close state)
   */
  const [theme, setTheme] = useState('light');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount] = useState(0); // Placeholder; can be replaced with useCart().totals.count

  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes. */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Close modal on route change to avoid stale overlay
  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  return (
    <div className="page">
      <Header
        onToggleTheme={toggleTheme}
        theme={theme}
        onOpenCart={openCart}
        cartCount={cartCount}
      />

      <main className="main">
        <div className="container inner">
          <section className="hero">
            <h1>Discover your next favorite read</h1>
            <div>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Browse Books
              </button>
            </div>
          </section>

          <div className="spacer" />

          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/book/:id"
              element={
                <section className="surface" style={{ padding: '1rem' }}>
                  <h1>Book Details</h1>
                  <p>This is a placeholder for the book detail page.</p>
                </section>
              }
            />
            <Route
              path="*"
              element={
                <section className="surface" style={{ padding: '1rem' }}>
                  <h1>Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </section>
              }
            />
          </Routes>
        </div>
      </main>

      <Footer />

      {isCartOpen && (
        <>
          <button
            className="cart-backdrop"
            aria-label="Close cart"
            onClick={closeCart}
          />
          <aside className="cart-modal" role="dialog" aria-modal="true" aria-label="Cart Quick View">
            <header>
              <strong>Cart</strong>
              <button className="btn" onClick={closeCart} aria-label="Close cart">
                Close
              </button>
            </header>
            <div className="content">
              <p>Your cart is currently empty.</p>
            </div>
            <footer>
              <button className="btn btn-primary" onClick={() => navigate('/cart')}>
                Go to Cart
              </button>
              <button className="btn" onClick={closeCart}>
                Continue Shopping
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}

export default App;
