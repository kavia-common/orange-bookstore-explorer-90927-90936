import React from "react";

// PUBLIC_INTERFACE
export default function BookCard({ book, onAdd }) {
  return (
    <div className="card" role="article" aria-label={`${book.title} by ${book.author}`}>
      <div className="cover" aria-hidden="true">
        {book.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="card-body">
        <div className="title">{book.title}</div>
        <div className="author">{book.author}</div>
        <div className="badge">{book.genre}</div>
        <div className="meta">
          <div className="price">${book.price.toFixed(2)}</div>
          <div className="popularity">★ {book.popularity.toFixed(1)}</div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={()=>onAdd(book)}>Add to cart</button>
          <button className="btn btn-ghost">Details</button>
        </div>
      </div>
    </div>
  );
}
