"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, TAX_RATE } from "@/lib/orders";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

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
        <div key={item.productId} className="cart-item">
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-price">
              {formatPrice(item.price)} each
            </div>
          </div>
          <div className="quantity-control">
            <button
              className="quantity-btn"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            >
              &minus;
            </button>
            <span className="quantity-num">{item.quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <div className="cart-item-total">
            {formatPrice(item.price * item.quantity)}
          </div>
          <button className="btn btn-danger" onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Tax (5.6%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <Link href="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <Link href="/checkout" className="btn btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
