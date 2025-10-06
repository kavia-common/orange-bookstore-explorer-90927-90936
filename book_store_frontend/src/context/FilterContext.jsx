import React, { createContext, useContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export const FilterContext = createContext({
  /** Array of selected genre identifiers/strings */
  selectedGenres: [],
  /** Array of selected author identifiers/strings */
  selectedAuthors: [],
  /** Search term entered by user */
  searchTerm: '',
  /** Sort option, e.g., 'price-asc' | 'price-desc' | 'popularity' */
  sort: 'relevance',
  /** Actions */
  setSearchTerm: () => {},
  toggleGenre: () => {},
  toggleAuthor: () => {},
  setSort: () => {},
  clearFilters: () => {},
});

const ACTIONS = {
  TOGGLE_GENRE: 'TOGGLE_GENRE',
  TOGGLE_AUTHOR: 'TOGGLE_AUTHOR',
  SET_SEARCH: 'SET_SEARCH',
  SET_SORT: 'SET_SORT',
  CLEAR: 'CLEAR',
};

const initialState = {
  selectedGenres: [],
  selectedAuthors: [],
  searchTerm: '',
  sort: 'relevance',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_GENRE: {
      const g = action.payload;
      const has = state.selectedGenres.includes(g);
      return {
        ...state,
        selectedGenres: has
          ? state.selectedGenres.filter((x) => x !== g)
          : [...state.selectedGenres, g],
      };
    }
    case ACTIONS.TOGGLE_AUTHOR: {
      const a = action.payload;
      const has = state.selectedAuthors.includes(a);
      return {
        ...state,
        selectedAuthors: has
          ? state.selectedAuthors.filter((x) => x !== a)
          : [...state.selectedAuthors, a],
      };
    }
    case ACTIONS.SET_SEARCH:
      return { ...state, searchTerm: action.payload };
    case ACTIONS.SET_SORT:
      return { ...state, sort: action.payload };
    case ACTIONS.CLEAR:
      return { ...initialState };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function FilterProvider({ children }) {
  /**
   * Provides filter state and actions to children.
   * Values:
   * - selectedGenres, selectedAuthors, searchTerm, sort
   * - setSearchTerm, toggleGenre, toggleAuthor, setSort, clearFilters
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      ...state,
      setSearchTerm: (term) => dispatch({ type: ACTIONS.SET_SEARCH, payload: term }),
      toggleGenre: (genre) => dispatch({ type: ACTIONS.TOGGLE_GENRE, payload: genre }),
      toggleAuthor: (author) => dispatch({ type: ACTIONS.TOGGLE_AUTHOR, payload: author }),
      setSort: (sort) => dispatch({ type: ACTIONS.SET_SORT, payload: sort }),
      clearFilters: () => dispatch({ type: ACTIONS.CLEAR }),
    }),
    [state]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

FilterProvider.propTypes = {
  children: PropTypes.node,
};

// PUBLIC_INTERFACE
export function useFilters() {
  /** Hook to access filter context safely. */
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return ctx;
}
