"use client";

import { useState } from "react";
import Link from "next/link";
import { richProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";
import { scheduleLocalNotification } from "@/lib/native/notifications";

const preOrderProducts = richProducts.filter((p) => p.isPreOrder);
const limitedProducts = richProducts.filter((p) => p.isLimited && !p.isPreOrder);

export default function PreOrdersPage() {
  const [reserved, setReserved] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [showNotify, setShowNotify] = useState<string | null>(null);

  async function handleReserve(productId: string) {
    await impactFeedback("MEDIUM");
    setReserved((prev) => new Set(prev).add(productId));
    await notificationFeedback();
    await scheduleLocalNotification(
      "Pre-order confirmed!",
      "We'll notify you when your item is ready to ship."
    );
  }

  async function handleNotifyMe(productId: string) {
    if (!email.trim()) return;
    await impactFeedback("LIGHT");
    setShowNotify(null);
    setReserved((prev) => new Set(prev).add(productId));
    await scheduleLocalNotification(
      "You're on the list!",
      `We'll email ${email} when this item is back or available.`
    );
  }

  return (
    <div className="preorders-page">
      <div className="hero">
        <h1>Pre-Orders & Limited Releases</h1>
        <p>Reserve upcoming flavors before they launch, or grab limited editions before they sell out.</p>
      </div>

      {/* Upcoming Pre-Orders */}
      {preOrderProducts.length > 0 && (
        <>
          <h2 className="section-title">Coming Soon</h2>
          <div className="product-grid">
            {preOrderProducts.map((product) => (
              <div key={product.id} className="product-card preorder-card">
                <div className="product-image">
                  <span className="product-badge badge-preorder">Pre-Order</span>
                  {"\u{1F36B}"}
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-desc">{product.description}</div>
                  {product.preOrderDate && (
                    <p className="preorder-date">
                      Available: {new Date(product.preOrderDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {reserved.has(product.id) ? (
                      <span className="reserved-badge">Reserved!</span>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReserve(product.id)}
                      >
                        Reserve Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Limited Editions */}
      {limitedProducts.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: 40 }}>Limited Editions</h2>
          <p className="section-subtitle">
            Small batch releases. When they&apos;re gone, they&apos;re gone.
          </p>
          <div className="product-grid">
            {limitedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <span className="product-badge badge-limited">Limited</span>
                  {product.isMembersOnly && (
                    <span className="product-badge badge-vip" style={{ right: "auto", left: 12 }}>VIP</span>
                  )}
                  {"\u{1F36B}"}
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-desc">{product.description}</div>
                  {product.availableQuantity && (
                    <div className="stock-bar">
                      <div className="stock-bar-fill" style={{ width: `${Math.min(100, (product.availableQuantity / 200) * 100)}%` }} />
                      <span className="stock-text">{product.availableQuantity} remaining</span>
                    </div>
                  )}
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <div className="product-actions">
                      <Link href={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                        Details
                      </Link>
                      {showNotify === product.id ? (
                        <div className="notify-form">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            style={{ padding: "6px 10px", fontSize: "0.85rem", borderRadius: 6, border: "1px solid #ccc" }}
                          />
                          <button className="btn btn-primary" style={{ padding: "6px 10px", fontSize: "0.85rem" }} onClick={() => handleNotifyMe(product.id)}>
                            Go
                          </button>
                        </div>
                      ) : reserved.has(product.id) ? (
                        <span className="reserved-badge">Notified!</span>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowNotify(product.id)}
                        >
                          Notify Me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
