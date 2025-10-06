/**
 * Simple Footer component.
 */
// PUBLIC_INTERFACE
export default function Footer() {
  /** Renders the site footer with copyright. */
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container inner">
        <div>© {year} Orange Bookstore</div>
        <div>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer" className="link">
            Learn React
          </a>
        </div>
      </div>
    </footer>
  );
}
