//
// API Service Layer with Adapter Pattern
// Supports Mock, REST (placeholder), and GraphQL (placeholder) adapters.
// Defaults to 'mock' mode if REACT_APP_API_MODE is undefined or unrecognized.
//

// PUBLIC_INTERFACE
export async function getBooks() {
  /**
   * Fetch a list of books using the configured adapter.
   * Returns: Promise<Array<Book>>
   */
  const adapter = selectAdapter();
  return adapter.getBooks();
}

// PUBLIC_INTERFACE
export async function getBookById(id) {
  /**
   * Fetch a single book by id using the configured adapter.
   * Params:
   *  - id: string | number
   * Returns: Promise<Book | undefined>
   */
  const adapter = selectAdapter();
  return adapter.getBookById(id);
}

/**
 * Adapter selection based on environment. Falls back to mock by default.
 */
function selectAdapter() {
  // Safely read env; CRA injects process.env at build time.
  const modeRaw = process?.env?.REACT_APP_API_MODE;
  const mode = typeof modeRaw === 'string' ? modeRaw.toLowerCase() : 'mock';

  switch (mode) {
    case 'rest':
      return RestAdapter;
    case 'graphql':
    case 'gql':
      return GraphQLAdapter;
    case 'mock':
    default:
      return MockAdapter;
  }
}

/**
 * Types (for reference)
 * Book: {
 *   id: string | number,
 *   title: string,
 *   author: string,
 *   genre: string,
 *   price: number,
 *   rating?: number,
 *   description?: string,
 *   cover?: string,
 *   popularity?: number
 * }
 */

// ---------------------- Mock Adapter ----------------------
import mockBooks from '../../data/mockBooks.json';

const MockAdapter = {
  /** Return all mock books. Simulate async latency. */
  async getBooks() {
    // Defensive copy to avoid mutation from callers.
    await delay(80);
    return mockBooks.map((b) => ({ ...b }));
  },
  /** Return a book by id (string or number). */
  async getBookById(id) {
    await delay(60);
    const idStr = String(id);
    const found = mockBooks.find((b) => String(b.id) === idStr);
    return found ? { ...found } : undefined;
  },
};

// ---------------------- REST Adapter (Placeholder) ----------------------
// TODO: Replace with real endpoints and error handling.
const RestAdapter = {
  async getBooks() {
    // Example:
    // const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/books`);
    // if (!res.ok) throw new Error('Failed to fetch books');
    // return res.json();
    console.warn('[API:REST] getBooks called but REST adapter is not implemented; returning mock as fallback.');
    return MockAdapter.getBooks();
  },
  async getBookById(id) {
    // Example:
    // const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/books/${id}`);
    // if (!res.ok) throw new Error('Failed to fetch book');
    // return res.json();
    console.warn('[API:REST] getBookById called but REST adapter is not implemented; returning mock as fallback.');
    return MockAdapter.getBookById(id);
  },
};

// ---------------------- GraphQL Adapter (Placeholder) ----------------------
// TODO: Replace with real GraphQL client call.
const GraphQLAdapter = {
  async getBooks() {
    // Example:
    // const query = `query { books { id title author genre price rating } }`;
    // const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
    // const data = await res.json();
    // return data?.data?.books ?? [];
    console.warn('[API:GQL] getBooks called but GraphQL adapter is not implemented; returning mock as fallback.');
    return MockAdapter.getBooks();
  },
  async getBookById(id) {
    // Example:
    // const query = `query ($id: ID!) { book(id: $id) { id title author ... } }`;
    // const res = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id } }) });
    // const data = await res.json();
    // return data?.data?.book;
    console.warn('[API:GQL] getBookById called but GraphQL adapter is not implemented; returning mock as fallback.');
    return MockAdapter.getBookById(id);
  },
};

// Utility: tiny latency simulation
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
