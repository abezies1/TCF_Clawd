"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="confirmation-page">
      <div className="confirmation-box">
        <div className="confirmation-check">&#10003;</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. We&apos;re preparing your chocolates.</p>

        {orderId && (
          <div className="confirmation-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order Number</span>
              <span style={{ fontWeight: 700 }}>{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        )}

        <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: 32 }}>
          You&apos;ll receive a confirmation at your email. Please bring your
          order number when you pick up at the shop.
        </p>

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
