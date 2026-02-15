"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const pickupMethod = searchParams.get("pickup");
  const pickupDate = searchParams.get("date");
  const pickupTime = searchParams.get("time");

  return (
    <div className="confirmation-page">
      <div className="confirmation-box">
        <div className="confirmation-check">&#10003;</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. We&apos;re preparing your chocolates.</p>

        <div className="confirmation-details">
          <h3>Order Details</h3>
          {orderId && (
            <div className="detail-row">
              <span>Order Number</span>
              <span style={{ fontWeight: 700 }}>
                {orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          )}
          {pickupMethod && (
            <div className="detail-row">
              <span>Pickup Method</span>
              <span style={{ fontWeight: 700 }}>
                {pickupMethod === "curbside"
                  ? "Curbside Pickup"
                  : "In-Store Pickup"}
              </span>
            </div>
          )}
          {pickupDate && (
            <div className="detail-row">
              <span>Pickup Date</span>
              <span style={{ fontWeight: 700 }}>{pickupDate}</span>
            </div>
          )}
          {pickupTime && (
            <div className="detail-row">
              <span>Pickup Time</span>
              <span style={{ fontWeight: 700 }}>{pickupTime}</span>
            </div>
          )}
        </div>

        {pickupMethod === "curbside" ? (
          <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: 32 }}>
            When you arrive, park in a designated curbside spot and
            we&apos;ll bring your order right out. You&apos;ll receive a
            confirmation at your email.
          </p>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: 32 }}>
            You&apos;ll receive a confirmation at your email. Please bring
            your order number when you pick up at the shop.
          </p>
        )}

        <Link href="/" className="btn btn-primary">
          Back to Menu
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="confirmation-page">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
