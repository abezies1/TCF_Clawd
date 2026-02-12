"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, PICKUP_TIMES, TAX_RATE } from "@/lib/orders";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="cart-empty">
          <p>Your cart is empty. Add some chocolates first!</p>
          <Link href="/" className="btn btn-primary">
            Browse Our Chocolates
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: formData.get("customerName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      pickupDate: formData.get("pickupDate") as string,
      pickupTime: formData.get("pickupTime") as string,
      notes: formData.get("notes") as string,
      items,
      subtotal,
      tax,
      total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();
      clearCart();
      router.push(`/confirmation?orderId=${data.orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item) => (
          <div key={item.productId} className="checkout-item">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="checkout-item" style={{ fontWeight: 700, marginTop: 8 }}>
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerName">Full Name</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            placeholder="Your name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="(520) 555-0123"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date</label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              required
              min={minDateStr}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time</label>
            <select id="pickupTime" name="pickupTime" required>
              <option value="">Select a time</option>
              {PICKUP_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Special Instructions (optional)</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Allergies, gift wrapping requests, etc."
          />
        </div>

        {error && (
          <p style={{ color: "var(--color-red)", marginBottom: 16 }}>{error}</p>
        )}

        <div className="cart-actions">
          <Link href="/cart" className="btn btn-secondary">
            Back to Cart
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
