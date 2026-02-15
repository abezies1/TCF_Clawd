"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getOrderHistory, StoredOrder } from "@/lib/storage";
import { formatPrice } from "@/lib/orders";
import { impactFeedback } from "@/lib/native/haptics";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    setOrders(getOrderHistory());
  }, []);

  async function handleReorder(order: StoredOrder) {
    await impactFeedback("MEDIUM");
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          variantId: item.variantId,
          productId: item.productId,
          name: item.name,
          variantTitle: item.variantTitle,
          price: item.price,
          image: item.image,
        });
      }
    });
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>Order History</h1>
        <div className="cart-empty">
          <p>No orders yet. Start browsing our chocolates!</p>
          <Link href="/" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Order History</h1>
      <p className="orders-subtitle">
        Tap &ldquo;Reorder&rdquo; to add all items back to your cart.
      </p>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-card-header">
            <div>
              <span className="order-id">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`order-status order-status-${order.status}`}>
                {order.status.replace("_", " ")}
              </span>
            </div>
            <span className="order-date">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="order-card-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-card-item">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="order-card-footer">
            <div className="order-card-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="order-card-pickup">
              {order.pickupMethod === "curbside"
                ? "Curbside"
                : "In-Store"}{" "}
              &bull; {order.pickupDate} at {order.pickupTime}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleReorder(order)}
              style={{ marginTop: 12, width: "100%" }}
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
