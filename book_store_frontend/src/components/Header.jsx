/**
 * Header component with brand, navigation links, theme toggle and cart button.
 * This is a lightweight, framework-free header adhering to the Ocean Professional theme.
 */
import { Link, NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header({ onToggleTheme, theme, onOpenCart, cartCount = 0 }) {
  /** Renders the site header. */
  return (
    <header className="site-header">
      <div className="container inner">
        <Link to="/" className="brand" aria-label="Book Store Home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Orange Bookstore</span>
        </Link>

        <nav aria-label="Primary Navigation" className="nav-actions">
          <NavLink to="/" className="btn btn-ghost">
            Home
          </NavLink>
          <NavLink to="/cart" className="btn btn-ghost" aria-label="Open cart page">
            Cart <span className="badge" aria-live="polite">{cartCount}</span>
          </NavLink>
          <button
            type="button"
            className="btn"
            onClick={onOpenCart}
            aria-label="Open cart quick view"
            title="Open cart quick view"
          >
            Quick Cart
          </button>
          <button
            type="button"
            className="btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </nav>
      </div>
    </header>
  );
}
