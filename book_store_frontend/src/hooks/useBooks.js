import { useEffect, useMemo, useState } from 'react';
import { getBooks } from '../services/api';
import { useFilters } from '../context/FilterContext.jsx';

/**
 * Utility: normalize string for case-insensitive matching.
 */
function norm(s) {
  return (s ?? '').toString().trim().toLowerCase();
}

/**
 * Utility: safe unique list from array of strings.
 */
function uniqueSortedStrings(arr) {
  const set = new Set();
  (arr || []).forEach((v) => {
    if (typeof v === 'string' && v.trim()) {
      set.add(v.trim());
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * Sorting helpers
 */
function sortBooks(books, sort) {
  const list = [...(books || [])];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price-desc':
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'popularity':
      return list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    case 'relevance':
    default:
      // No-op; maintain current order which comes from API/mock
      return list;
  }
}

// PUBLIC_INTERFACE
export default function useBooks() {
  /**
   * Custom hook to:
   * - Load books via services/api adapter (mock by default).
   * - Expose allGenres/allAuthors lists.
   * - Apply FilterContext filters: selectedGenres, selectedAuthors, searchTerm (case-insensitive).
   * - Apply sorting by price asc/desc or popularity desc.
   * - Memoize derived data to avoid unnecessary recalculations.
   *
   * Returns:
   * {
   *   books,         // filtered + sorted list
   *   allGenres,     // unique genres (sorted)
   *   allAuthors,    // unique authors (sorted)
   *   loading,       // boolean
   *   error          // Error | null
   * }
   */
  const [rawBooks, setRawBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consume FilterContext; defensively fallback if provider isn't present
  let selectedGenres = [];
  let selectedAuthors = [];
  let searchTerm = '';
  let sort = 'relevance';
  try {
    const f = useFilters();
    selectedGenres = f.selectedGenres ?? [];
    selectedAuthors = f.selectedAuthors ?? [];
    searchTerm = f.searchTerm ?? '';
    sort = f.sort ?? 'relevance';
  } catch {
    // If context is unavailable, we still operate with defaults.
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getBooks()
      .then((data) => {
        if (!mounted) return;
        const safe = Array.isArray(data) ? data : [];
        setRawBooks(safe.map((b) => ({ ...b })));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load books'));
        setRawBooks([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const allGenres = useMemo(() => {
    const genres = rawBooks.map((b) => b?.genre).filter((g) => typeof g === 'string' && g.trim());
    return uniqueSortedStrings(genres);
  }, [rawBooks]);

  const allAuthors = useMemo(() => {
    const authors = rawBooks.map((b) => b?.author).filter((a) => typeof a === 'string' && a.trim());
    return uniqueSortedStrings(authors);
  }, [rawBooks]);

  const filteredSortedBooks = useMemo(() => {
    if (!Array.isArray(rawBooks) || rawBooks.length === 0) return [];

    const selGenres = Array.isArray(selectedGenres) ? selectedGenres.map((g) => norm(g)) : [];
    const selAuthors = Array.isArray(selectedAuthors) ? selectedAuthors.map((a) => norm(a)) : [];
    const q = norm(searchTerm);

    const filtered = rawBooks.filter((b) => {
      const g = norm(b?.genre);
      const a = norm(b?.author);
      const t = norm(b?.title);

      // genre filter: if any selected, record must match one
      if (selGenres.length > 0 && !selGenres.includes(g)) return false;
      // author filter: if any selected, record must match one
      if (selAuthors.length > 0 && !selAuthors.includes(a)) return false;

      // search term filter: match title OR author OR id string
      if (q) {
        const matches =
          t.includes(q) ||
          a.includes(q) ||
          norm(String(b?.id)).includes(q);
        if (!matches) return false;
      }
      return true;
    });

    return sortBooks(filtered, sort);
  }, [rawBooks, selectedGenres, selectedAuthors, searchTerm, sort]);

  return {
    books: filteredSortedBooks,
    allGenres,
    allAuthors,
    loading,
    error,
  };
}
