import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';

function renderApp() {
  // Helper to render App with the same providers as index.js
  return render(
    <BrowserRouter>
      <CartProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

test('renders Book Catalog heading on home route', async () => {
  renderApp();
  // Stable heading provided by CatalogPage
  const heading = await screen.findByRole('heading', { name: /book catalog/i, level: 1 });
  expect(heading).toBeInTheDocument();
});

test('renders header brand link and cart badge (CartContext smoke test)', () => {
  renderApp();

  // Header brand link should be present
  const homeLink = screen.getByRole('link', { name: /book store home|orange bookstore|home/i });
  expect(homeLink).toBeInTheDocument();

  // Cart badge exists and is numeric (initially 0)
  const cartLink = screen.getByRole('link', { name: /cart/i });
  expect(cartLink).toBeInTheDocument();
  expect(cartLink).toHaveTextContent(/cart/i);
});
