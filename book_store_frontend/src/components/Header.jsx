 /** 
  * Header component with brand, navigation links, theme toggle and cart button.
  * This is a lightweight, framework-free header adhering to the Ocean Professional theme.
  */
 import { Link, NavLink } from 'react-router-dom';
 import { useFilters } from '../context/FilterContext.jsx';
 import logoUrl from '../assets/logo.svg';

 // PUBLIC_INTERFACE
 export default function Header({ onToggleTheme, theme, onOpenCart, cartCount = 0 }) {
   /** Renders the site header. */
   // Safely attempt to consume FilterContext; if provider isn't mounted, fall back gracefully.
   let searchTerm = '';
   let setSearchTerm = () => {};
   try {
     const ctx = useFilters();
     searchTerm = ctx.searchTerm ?? '';
     setSearchTerm = ctx.setSearchTerm ?? (() => {});
   } catch {
     // no provider mounted yet; ignore to avoid runtime error in isolated renders/tests
   }

   // Determine if logo asset exists; if import fails in some envs, fallback to text brand.
   const hasLogo = !!logoUrl;

   return (
     <header className="site-header">
       <div className="container inner">
         <Link to="/" className="brand" aria-label="Book Store Home">
           {hasLogo ? (
             <img
               src={logoUrl}
               alt="Orange Bookstore"
               width="140"
               height="32"
               style={{ display: 'block', height: '32px', width: 'auto' }}
             />
           ) : (
             <>
               <span className="brand-mark" aria-hidden="true" />
               <span>Orange Bookstore</span>
             </>
           )}
         </Link>
 
         {/* Center-aligned search input wired to FilterContext */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
           <label htmlFor="site-search" className="visually-hidden">Search books</label>
           <input
             id="site-search"
             type="search"
             placeholder="Search books, authors, ISBN..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{
               width: 'min(520px, 100%)',
               padding: '.5rem .75rem',
               borderRadius: '10px',
               border: '1px solid rgba(0,0,0,0.08)',
               background: 'var(--surface)',
               color: 'var(--text)',
               boxShadow: 'var(--shadow-sm)',
             }}
           />
         </div>
 
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
