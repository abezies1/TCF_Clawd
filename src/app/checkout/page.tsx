"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createCheckout } from "@/lib/shopify";
import { formatPrice, PICKUP_TIMES, TAX_RATE } from "@/lib/orders";

type PickupMethod = "in-store" | "curbside";

function getMinPickupDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>("in-store");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link href="/" className="btn btn-primary">
            Browse Our Chocolates
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all contact information.");
      return;
    }
    if (!pickupDate || !pickupTime) {
      setError("Please select a pickup date and time.");
      return;
    }
    if (pickupMethod === "curbside" && !vehicleDescription.trim()) {
      setError("Please describe your vehicle for curbside pickup.");
      return;
    }

    setSubmitting(true);

    try {
      const lineItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const customAttributes = [
        { key: "Customer Name", value: name.trim() },
        { key: "Email", value: email.trim() },
        { key: "Phone", value: phone.trim() },
        { key: "Pickup Method", value: pickupMethod === "curbside" ? "Curbside Pickup" : "In-Store Pickup" },
        { key: "Pickup Date", value: pickupDate },
        { key: "Pickup Time", value: pickupTime },
      ];

      if (pickupMethod === "curbside") {
        customAttributes.push({
          key: "Vehicle Description",
          value: vehicleDescription.trim(),
        });
      }

      if (notes.trim()) {
        customAttributes.push({ key: "Order Notes", value: notes.trim() });
      }

      const { webUrl } = await createCheckout(lineItems, customAttributes);
      clearCart();
      window.location.href = webUrl;
    } catch {
      setError("Could not start checkout. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.variantId} className="checkout-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="checkout-item" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-cream-dark)" }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="checkout-item">
            <span>Tax (5.6%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="checkout-item" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            <span>Estimated Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="checkout-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(520) 555-0123"
                required
              />
            </div>
          </div>
        </div>

        {/* Pickup Method */}
        <div className="checkout-section">
          <h3>Pickup Method</h3>
          <div className="pickup-options">
            <label
              className={`pickup-option ${pickupMethod === "in-store" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="pickupMethod"
                value="in-store"
                checked={pickupMethod === "in-store"}
                onChange={() => setPickupMethod("in-store")}
              />
              <div className="pickup-option-content">
                <span className="pickup-option-icon">&#127978;</span>
                <span className="pickup-option-label">In-Store Pickup</span>
                <span className="pickup-option-desc">
                  Pick up inside the shop
                </span>
              </div>
            </label>
            <label
              className={`pickup-option ${pickupMethod === "curbside" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="pickupMethod"
                value="curbside"
                checked={pickupMethod === "curbside"}
                onChange={() => setPickupMethod("curbside")}
              />
              <div className="pickup-option-content">
                <span className="pickup-option-icon">&#128663;</span>
                <span className="pickup-option-label">Curbside Pickup</span>
                <span className="pickup-option-desc">
                  We&apos;ll bring it to your car
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Pickup Date & Time */}
        <div className="checkout-section">
          <h3>Pickup Date &amp; Time</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupDate">Date</label>
              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                min={getMinPickupDate()}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pickupTime">Time</label>
              <select
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="">Select a time</option>
                {PICKUP_TIMES.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Info (curbside only) */}
        {pickupMethod === "curbside" && (
          <div className="checkout-section">
            <h3>Vehicle Information</h3>
            <div className="form-group">
              <label htmlFor="vehicle">Vehicle Description</label>
              <input
                id="vehicle"
                type="text"
                value={vehicleDescription}
                onChange={(e) => setVehicleDescription(e.target.value)}
                placeholder="e.g. Red Toyota Camry, license plate ABC-1234"
                required
              />
            </div>
            <p className="pickup-note">
              When you arrive, park in a designated curbside spot and we&apos;ll
              bring your order out.
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="checkout-section">
          <h3>Special Instructions</h3>
          <div className="form-group">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes for your order..."
              rows={3}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "var(--color-red)", marginBottom: 16 }}>{error}</p>
        )}

        <div className="cart-actions">
          <Link href="/cart" className="btn btn-secondary">
            Back to Cart
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Processing..." : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
