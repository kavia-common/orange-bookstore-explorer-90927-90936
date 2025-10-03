import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { applyThemeCssVars } from "./theme";
import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import FiltersSidebar from "./components/FiltersSidebar";
import BookGrid from "./components/BookGrid";
import CartModal from "./components/CartModal";
import { fetchBooks, fetchFilters } from "./services/api";

/**
 * PUBLIC_INTERFACE
 * App is the main entry point for the Ocean Bookstore frontend.
 * It renders:
 *  - Header with search and cart access
 *  - Sidebar filters (genre and author)
 *  - Catalog grid with sorting (price/popularity/title)
 *  - Cart modal for managing items and checkout
 */
function AppRoot() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ genres: [], authors: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [selectedAuthors, setSelectedAuthors] = useState(new Set());
  const [sort, setSort] = useState("popularity");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    applyThemeCssVars(); // init theme
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [b, f] = await Promise.all([fetchBooks(), fetchFilters()]);
        if (mounted) {
          setBooks(b);
          setFilters(f);
        }
      } catch (e) {
        console.error(e);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onToggleGenre = (g) => {
    setSelectedGenres(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };
  const onToggleAuthor = (a) => {
    setSelectedAuthors(prev => {
      const next = new Set();
      if (a) next.add(a);
      return next;
    });
  };
  const onClear = () => {
    setSelectedAuthors(new Set());
    setSelectedGenres(new Set());
    setQuery("");
  };

  const visibleBooks = useMemo(() => {
    let data = books;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter(b => b.title.toLowerCase().includes(q));
    }
    if (selectedGenres.size) {
      data = data.filter(b => selectedGenres.has(b.genre));
    }
    if (selectedAuthors.size) {
      const a = [...selectedAuthors][0];
      data = data.filter(b => b.author === a);
    }
    switch (sort) {
      case "price-asc":
        data = [...data].sort((a,b)=>a.price - b.price); break;
      case "price-desc":
        data = [...data].sort((a,b)=>b.price - a.price); break;
      case "title-asc":
        data = [...data].sort((a,b)=>a.title.localeCompare(b.title)); break;
      case "popularity":
      default:
        data = [...data].sort((a,b)=>b.popularity - a.popularity); break;
    }
    return data;
  }, [books, query, selectedGenres, selectedAuthors, sort]);

  return (
    <>
      <Header onOpenCart={()=>setCartOpen(true)} query={query} setQuery={setQuery} />
      <main className="container">
        <div className="layout">
          <FiltersSidebar
            genres={filters.genres}
            authors={filters.authors}
            selectedGenres={selectedGenres}
            selectedAuthors={selectedAuthors}
            onToggleGenre={onToggleGenre}
            onToggleAuthor={onToggleAuthor}
            onClear={onClear}
          />
          <section aria-busy={loading}>
            {loading ? (
              <div style={{padding:"24px 0", color:"var(--color-muted)"}}>Loading books…</div>
            ) : (
              <BookGrid books={visibleBooks} sort={sort} setSort={setSort} onAdd={()=>{}} />
            )}
          </section>
        </div>
        <div className="footer-note">Ocean Professional • Blue & amber accents • Responsive, modern UI</div>
      </main>
      {cartOpen && <CartModal onClose={()=>setCartOpen(false)} />}
    </>
  );
}

function WithCart() {
  const cart = useCart();
  const onAdd = (book) => cart.add(book);
  return <AppRootWithAdd onAdd={onAdd} />;
}

// Helper to pass onAdd down to BookGrid via context bridging
function AppRootWithAdd({ onAdd }) {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ genres: [], authors: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [selectedAuthors, setSelectedAuthors] = useState(new Set());
  const [sort, setSort] = useState("popularity");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { applyThemeCssVars(); }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [b, f] = await Promise.all([fetchBooks(), fetchFilters()]);
        if (mounted) {
          setBooks(b);
          setFilters(f);
        }
      } catch (e) {
        console.error(e);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onToggleGenre = (g) => {
    setSelectedGenres(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };
  const onToggleAuthor = (a) => {
    setSelectedAuthors(prev => {
      const next = new Set();
      if (a) next.add(a);
      return next;
    });
  };
  const onClear = () => { setSelectedAuthors(new Set()); setSelectedGenres(new Set()); setQuery(""); };

  const visibleBooks = useMemo(() => {
    let data = books;
    if (query.trim()) data = data.filter(b => b.title.toLowerCase().includes(query.trim().toLowerCase()));
    if (selectedGenres.size) data = data.filter(b => selectedGenres.has(b.genre));
    if (selectedAuthors.size) data = data.filter(b => b.author === [...selectedAuthors][0]);
    switch (sort) {
      case "price-asc": data = [...data].sort((a,b)=>a.price-b.price); break;
      case "price-desc": data = [...data].sort((a,b)=>b.price-a.price); break;
      case "title-asc": data = [...data].sort((a,b)=>a.title.localeCompare(b.title)); break;
      default: data = [...data].sort((a,b)=>b.popularity-a.popularity);
    }
    return data;
  }, [books, query, selectedGenres, selectedAuthors, sort]);

  return (
    <>
      <Header onOpenCart={()=>setCartOpen(true)} query={query} setQuery={setQuery} />
      <main className="container">
        <div className="layout">
          <FiltersSidebar
            genres={filters.genres}
            authors={filters.authors}
            selectedGenres={selectedGenres}
            selectedAuthors={selectedAuthors}
            onToggleGenre={onToggleGenre}
            onToggleAuthor={onToggleAuthor}
            onClear={onClear}
          />
          <section aria-busy={loading}>
            {loading ? (
              <div style={{padding:"24px 0", color:"var(--color-muted)"}}>Loading books…</div>
            ) : (
              <BookGrid books={visibleBooks} sort={sort} setSort={setSort} onAdd={onAdd} />
            )}
          </section>
        </div>
        <div className="footer-note">Ocean Professional • Blue & amber accents • Responsive, modern UI</div>
      </main>
      {cartOpen && <CartModal onClose={()=>setCartOpen(false)} />}
    </>
  );
}

/**
 * PUBLIC_INTERFACE
 * App wraps the app with the CartProvider.
 */
export default function App() {
  return (
    <CartProvider>
      <WithCart />
    </CartProvider>
  );
}
