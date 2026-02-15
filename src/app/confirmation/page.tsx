"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
  startGeofenceMonitoring,
  stopGeofenceMonitoring,
  getDirectionsUrl,
  getGoogleMapsUrl,
  formatDistance,
  getCurrentPosition,
  getDistanceToStore,
} from "@/lib/native/geolocation";
import { isIOS } from "@/lib/native/platform";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const pickupMethod = searchParams.get("pickup");
  const pickupDate = searchParams.get("date");
  const pickupTime = searchParams.get("time");

  const [distance, setDistance] = useState<string | null>(null);
  const [nearStore, setNearStore] = useState(false);

  useEffect(() => {
    // Get initial distance to store
    getCurrentPosition().then((coords) => {
      if (coords) {
        const dist = getDistanceToStore(coords);
        setDistance(formatDistance(dist));
      }
    });

    // Start geofence monitoring for curbside orders
    if (pickupMethod === "curbside") {
      startGeofenceMonitoring((entered, coords) => {
        setNearStore(entered);
        const dist = getDistanceToStore(coords);
        setDistance(formatDistance(dist));
      });
    }

    return () => {
      stopGeofenceMonitoring();
    };
  }, [pickupMethod]);

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
          {distance && (
            <div className="detail-row">
              <span>Distance to Store</span>
              <span style={{ fontWeight: 700 }}>{distance}</span>
            </div>
          )}
        </div>

        {pickupMethod === "curbside" ? (
          <div className="confirmation-curbside">
            {nearStore ? (
              <p className="arrival-alert">
                You&apos;re near the store! We&apos;re preparing your order for
                curbside delivery.
              </p>
            ) : (
              <>
                <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: 16 }}>
                  When you arrive, park in a designated curbside spot and
                  we&apos;ll bring your order right out. The app will
                  automatically notify us when you&apos;re nearby.
                </p>
                <a
                  href={isIOS() ? getDirectionsUrl() : getGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ marginBottom: 16 }}
                >
                  Get Directions
                </a>
              </>
            )}
          </div>
        ) : (
          <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: 32 }}>
            You&apos;ll receive a confirmation at your email. Please bring
            your order number when you pick up at the shop.
          </p>
        )}

        <div className="confirmation-actions">
          <Link href="/orders" className="btn btn-secondary">
            View Orders
          </Link>
          <Link href="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
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
