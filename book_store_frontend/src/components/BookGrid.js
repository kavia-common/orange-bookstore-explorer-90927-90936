import React from "react";
import BookCard from "./BookCard";

// PUBLIC_INTERFACE
export default function BookGrid({ books = [], sort, setSort, onAdd }) {
  return (
    <>
      <div className="catalog-header">
        <div>
          <strong>Catalog</strong> • {books.length} results
        </div>
        <div className="sorting">
          <label htmlFor="sortSel" style={{color:"var(--color-muted)", fontSize:13}}>Sort by</label>
          <select id="sortSel" className="sort-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A → Z</option>
          </select>
        </div>
      </div>
      <div className="grid">
        {books.map(b => (
          <BookCard key={b.id} book={b} onAdd={onAdd} />
        ))}
      </div>
    </>
  );
}
