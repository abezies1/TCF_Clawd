"use client";

import { useState, useEffect } from "react";
import { getLoyaltyData, redeemLoyaltyCode, LoyaltyData } from "@/lib/storage";
import { scanQRCode, isCameraSupported } from "@/lib/native/camera";
import { notificationFeedback, impactFeedback } from "@/lib/native/haptics";

const TIER_INFO = {
  bronze: { label: "Bronze", color: "#cd7f32", next: "Silver", pointsNeeded: 200 },
  silver: { label: "Silver", color: "#c0c0c0", next: "Gold", pointsNeeded: 500 },
  gold: { label: "Gold", color: "#c8952e", next: "Chocolate", pointsNeeded: 1000 },
  chocolate: { label: "Chocolate", color: "#3e2215", next: null, pointsNeeded: null },
};

export default function LoyaltyPage() {
  const [loyalty, setLoyalty] = useState<LoyaltyData>(getLoyaltyData());
  const [manualCode, setManualCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setLoyalty(getLoyaltyData());
  }, []);

  const tier = TIER_INFO[loyalty.tier];
  const progressToNext = tier.pointsNeeded
    ? Math.min((loyalty.points / tier.pointsNeeded) * 100, 100)
    : 100;

  async function handleScanQR() {
    setScanning(true);
    setMessage("");
    await impactFeedback("LIGHT");

    const result = await scanQRCode();
    setScanning(false);

    if (result.success && result.data) {
      handleRedeemCode(result.data);
    } else {
      setMessage(result.error || "Could not scan QR code");
      setMessageType("error");
    }
  }

  async function handleRedeemCode(code: string) {
    const result = redeemLoyaltyCode(code);
    setLoyalty(getLoyaltyData());
    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");
    setManualCode("");

    if (result.success) {
      await notificationFeedback();
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualCode.trim()) {
      handleRedeemCode(manualCode.trim().toUpperCase());
    }
  }

  return (
    <div className="loyalty-page">
      <h1>Loyalty Rewards</h1>

      {/* Loyalty Card */}
      <div
        className="loyalty-card"
        style={{ borderColor: tier.color }}
      >
        <div className="loyalty-tier" style={{ color: tier.color }}>
          {tier.label} Member
        </div>
        <div className="loyalty-points">{loyalty.points}</div>
        <div className="loyalty-points-label">Points</div>

        {tier.pointsNeeded && (
          <div className="loyalty-progress-section">
            <div className="loyalty-progress-bar">
              <div
                className="loyalty-progress-fill"
                style={{
                  width: `${progressToNext}%`,
                  backgroundColor: tier.color,
                }}
              />
            </div>
            <div className="loyalty-progress-text">
              {tier.pointsNeeded - loyalty.points} points to {tier.next}
            </div>
          </div>
        )}

        <div className="loyalty-stats">
          <div className="loyalty-stat">
            <span className="loyalty-stat-num">{loyalty.totalOrders}</span>
            <span className="loyalty-stat-label">Orders</span>
          </div>
          <div className="loyalty-stat">
            <span className="loyalty-stat-num">
              {loyalty.scannedCodes.length}
            </span>
            <span className="loyalty-stat-label">Codes Redeemed</span>
          </div>
        </div>
      </div>

      {/* Scan QR Code */}
      <div className="loyalty-section">
        <h3>Earn Points</h3>
        <p>Scan a QR code at the shop or enter a code below.</p>

        {isCameraSupported() && (
          <button
            className="btn btn-primary scan-btn"
            onClick={handleScanQR}
            disabled={scanning}
          >
            {scanning ? "Scanning..." : "Scan QR Code"}
          </button>
        )}

        <form onSubmit={handleManualSubmit} className="code-form">
          <div className="form-group">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter code (e.g. TCF25-ABCD)"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={!manualCode.trim()}>
            Redeem
          </button>
        </form>

        {message && (
          <p
            className="loyalty-message"
            style={{
              color:
                messageType === "success"
                  ? "var(--color-green)"
                  : "var(--color-red)",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Rewards Info */}
      <div className="loyalty-section">
        <h3>Rewards Tiers</h3>
        <div className="rewards-tiers">
          {Object.entries(TIER_INFO).map(([key, info]) => (
            <div
              key={key}
              className={`reward-tier ${loyalty.tier === key ? "active" : ""}`}
            >
              <div className="reward-tier-dot" style={{ backgroundColor: info.color }} />
              <div className="reward-tier-info">
                <span className="reward-tier-name">{info.label}</span>
                <span className="reward-tier-req">
                  {info.pointsNeeded ? `${info.pointsNeeded} pts` : "Max tier"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="loyalty-section">
        <h3>Member Benefits</h3>
        <ul className="benefits-list">
          <li>Earn 1 point per dollar spent</li>
          <li>Bonus points from in-store QR codes</li>
          <li>Silver: 10% off every 5th order</li>
          <li>Gold: Free truffle with every order</li>
          <li>Chocolate: 15% off all orders + free shipping</li>
        </ul>
      </div>
    </div>
  );
}
