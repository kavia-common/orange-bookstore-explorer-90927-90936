const API_BASE = process.env.REACT_APP_API_BASE || ""; // comment: to be provided by user via .env
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_URL || "";

// PUBLIC_INTERFACE
export async function fetchBooks() {
  // Try REST first if configured; otherwise return mock data
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/books`);
    if (!res.ok) throw new Error("Failed to fetch books");
    return res.json();
  }
  // Mock dataset used for local development
  return mockBooks();
}

// PUBLIC_INTERFACE
export async function fetchFilters() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/books/filters`);
    if (!res.ok) throw new Error("Failed to fetch filters");
    return res.json();
  }
  const books = await mockBooks();
  const genres = Array.from(new Set(books.map(b => b.genre))).sort();
  const authors = Array.from(new Set(books.map(b => b.author))).sort();
  return { genres, authors };
}

// PUBLIC_INTERFACE
export async function createOrder(payload) {
  // Tries GraphQL mutation if configured; otherwise REST; else mock success
  if (GRAPHQL_ENDPOINT) {
    const mutation = `
      mutation CreateOrder($input: OrderInput!) {
        createOrder(input: $input) { id status total }
      }
    `;
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation, variables: { input: payload } })
    });
    const body = await res.json();
    if (body.errors) throw new Error(body.errors[0]?.message || "GraphQL error");
    return body.data.createOrder;
  }
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
  }
  // Mock success
  return { id: Math.random().toString(36).slice(2), status: "CONFIRMED", total: payload.items.reduce((s,i)=>s+i.price*i.quantity,0) };
}

function mockBooks() {
  // A small curated list with genre and popularity for demo
  const data = [
    { id:"1", title:"The Ocean Between", author:"A. Marlowe", price:18.99, popularity:4.5, genre:"Fiction" },
    { id:"2", title:"Amber Waves", author:"L. Chen", price:22.50, popularity:4.9, genre:"Fiction" },
    { id:"3", title:"Designing Systems", author:"R. Patel", price:36.00, popularity:4.7, genre:"Technology" },
    { id:"4", title:"React By Example", author:"S. Gomez", price:29.00, popularity:4.8, genre:"Technology" },
    { id:"5", title:"Mindful Productivity", author:"K. Tanaka", price:21.00, popularity:4.2, genre:"Self-Help" },
    { id:"6", title:"Winds of the North", author:"J. Sørensen", price:16.75, popularity:3.9, genre:"Fiction" },
    { id:"7", title:"GraphQL in Action", author:"N. Shah", price:33.49, popularity:4.6, genre:"Technology" },
    { id:"8", title:"Culinary Journeys", author:"P. Laurent", price:27.99, popularity:4.1, genre:"Cooking" },
  ];
  // Simulate network delay
  return new Promise(resolve => setTimeout(()=>resolve(data), 350));
}
