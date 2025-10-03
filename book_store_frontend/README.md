# Ocean Bookstore Frontend (React)

A modern, responsive frontend for browsing books with filtering, sorting, and a cart/checkout flow. Styled with the Ocean Professional theme (blue & amber accents).

## Features
- Browse books in a responsive grid
- Filter by genre and author
- Sort by price and popularity (and title)
- Cart modal with quantity controls and item removal
- REST/GraphQL integration-ready with local mock fallback
- Smooth transitions, rounded corners, subtle gradients

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## API Configuration (optional)

Create a `.env` at the project root to connect to your backend:

```
REACT_APP_API_BASE=https://your-rest-api.example.com
REACT_APP_GRAPHQL_URL=https://your-graphql-endpoint.example.com/graphql
```

- If not provided, the app uses a local mock dataset.

## Theme

The Ocean Professional theme tokens are located in `src/theme.js` and applied as CSS variables. Global styles live in `src/styles.css`.

## Scripts

- `npm start` – Start development server
- `npm run build` – Production build
- `npm test` – Test runner (no default UI tests included)

## Notes
- This app is built on Create React App without external UI libraries to keep it lightweight.
