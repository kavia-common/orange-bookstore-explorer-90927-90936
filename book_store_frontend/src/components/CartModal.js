import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

// PUBLIC_INTERFACE
export default function CartModal({ onClose }) {
  const cart = useCart();
  const items = Object.values(cart.items);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onCheckout = async () => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        items: items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
        total: cart.totalPrice
      };
      const res = await createOrder(payload);
      setMessage(`Order ${res.id} confirmed • $${res.total?.toFixed?.(2) ?? cart.totalPrice.toFixed(2)}`);
      cart.clear();
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>Your Cart</strong>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close cart">Close</button>
        </div>
        <div className="modal-content">
          {items.length === 0 ? (
            <div style={{color:"var(--color-muted)"}}>Your cart is empty.</div>
          ) : (
            items.map(i => (
              <div key={i.id} className="cart-line">
                <div>
                  <div style={{fontWeight:700}}>{i.title}</div>
                  <div style={{fontSize:12, color:"var(--color-muted)"}}>{i.author}</div>
                </div>
                <div className="qty" aria-label={`Quantity for ${i.title}`}>
                  <button onClick={()=>cart.setQty(i.id, i.quantity - 1)} aria-label="Decrease quantity">-</button>
                  <span>{i.quantity}</span>
                  <button onClick={()=>cart.setQty(i.id, i.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <div style={{fontWeight:700}}>${(i.price * i.quantity).toFixed(2)}</div>
                <div>
                  <button className="btn btn-ghost" onClick={()=>cart.remove(i.id)} aria-label={`Remove ${i.title}`}>Remove</button>
                </div>
              </div>
            ))
          )}
          <div className="total">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          {message && (
            <div className={message.startsWith("Error") ? "alert" : ""} style={{marginTop:10}}>
              {message}
            </div>
          )}
        </div>
        <div style={{display:"flex", gap:10, justifyContent:"flex-end", padding:"0 18px 16px"}}>
          <button className="btn btn-ghost" onClick={onClose}>Continue shopping</button>
          <button className="btn btn-primary" disabled={items.length===0 || loading} onClick={onCheckout}>
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
