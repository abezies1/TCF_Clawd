"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { createCheckout } from "@/lib/shopify";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setCheckingOut(true);
    setError("");

    try {
      const lineItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const { webUrl } = await createCheckout(lineItems);
      clearCart();
      window.location.href = webUrl;
    } catch {
      setError("Could not start checkout. Please try again.");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link href="/" className="btn btn-primary">
            Browse Our Chocolates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {items.map((item) => (
        <div key={item.variantId} className="cart-item">
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            {item.variantTitle !== "Default Title" && (
              <div style={{ fontSize: "0.85rem", color: "#888" }}>
                {item.variantTitle}
              </div>
            )}
            <div className="cart-item-price">
              {formatPrice(item.price)} each
            </div>
          </div>
          <div className="quantity-control">
            <button
              className="quantity-btn"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
            >
              &minus;
            </button>
            <span className="quantity-num">{item.quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <div className="cart-item-total">
            {formatPrice(item.price * item.quantity)}
          </div>
          <button
            className="btn btn-danger"
            onClick={() => removeItem(item.variantId)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="cart-summary-row" style={{ fontSize: "0.9rem", color: "#888" }}>
          <span>Tax &amp; shipping calculated at checkout</span>
        </div>
        <div className="cart-summary-row total">
          <span>Estimated Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      {error && (
        <p style={{ color: "var(--color-red)", marginTop: 12 }}>{error}</p>
      )}

      <div className="cart-actions">
        <Link href="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <button
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={checkingOut}
        >
          {checkingOut ? "Redirecting..." : "Checkout with Shopify"}
        </button>
      </div>
    </div>
  );
}
