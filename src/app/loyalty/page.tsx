"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLoyaltyData, redeemLoyaltyCode, LoyaltyData, getUserProfile, saveUserProfile } from "@/lib/storage";
import { scanQRCode, isCameraSupported } from "@/lib/native/camera";
import { notificationFeedback, impactFeedback } from "@/lib/native/haptics";

const TIER_INFO = {
  bronze: { label: "Bronze", color: "#cd7f32", next: "Silver", pointsNeeded: 200, perks: ["Earn 1 point per dollar", "Digital stamp card"] },
  silver: { label: "Silver", color: "#c0c0c0", next: "Gold", pointsNeeded: 500, perks: ["10% off every 5th order", "Early access to seasonal releases", "Birthday free truffle box"] },
  gold: { label: "Gold", color: "#c8952e", next: "Chocolate", pointsNeeded: 1000, perks: ["Free truffle with every order", "VIP early access to all releases", "Birthday deluxe box", "Exclusive tasting invites"] },
  chocolate: { label: "Chocolate", color: "#3e2215", next: null, pointsNeeded: null, perks: ["15% off all orders", "Free shipping always", "Members-only flavors", "Birthday grand gift box", "Private tasting for 2", "Anniversary bonus (100 pts)"] },
};

export default function LoyaltyPage() {
  const [loyalty, setLoyalty] = useState<LoyaltyData>(getLoyaltyData());
  const [manualCode, setManualCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [scanning, setScanning] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [birthdaySaved, setBirthdaySaved] = useState(false);

  useEffect(() => {
    setLoyalty(getLoyaltyData());
    const profile = getUserProfile();
    if (profile?.birthday) setBirthday(profile.birthday);
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
    if (result.success) await notificationFeedback();
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualCode.trim()) handleRedeemCode(manualCode.trim().toUpperCase());
  }

  function handleSaveBirthday() {
    const profile = getUserProfile() || {
      name: "", email: "", phone: "",
      biometricsEnabled: false, notificationsEnabled: false,
    };
    profile.birthday = birthday;
    saveUserProfile(profile);
    setBirthdaySaved(true);
    setTimeout(() => setBirthdaySaved(false), 2000);
  }

  // Check if birthday reward is available
  const profile = typeof window !== "undefined" ? getUserProfile() : null;
  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const isBirthday = profile?.birthday === todayMD;

  return (
    <div className="loyalty-page">
      <h1>Loyalty Rewards</h1>

      {/* Birthday Alert */}
      {isBirthday && (
        <div className="birthday-alert">
          <span>{"\u{1F382}"}</span>
          <div>
            <strong>Happy Birthday!</strong>
            <p>Check below for your special birthday reward.</p>
          </div>
        </div>
      )}

      {/* Loyalty Card */}
      <div className="loyalty-card" style={{ borderColor: tier.color }}>
        <div className="loyalty-tier" style={{ color: tier.color }}>{tier.label} Member</div>
        <div className="loyalty-points">{loyalty.points}</div>
        <div className="loyalty-points-label">Points</div>

        {tier.pointsNeeded && (
          <div className="loyalty-progress-section">
            <div className="loyalty-progress-bar">
              <div className="loyalty-progress-fill" style={{ width: `${progressToNext}%`, backgroundColor: tier.color }} />
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
            <span className="loyalty-stat-num">{loyalty.scannedCodes.length}</span>
            <span className="loyalty-stat-label">Codes Redeemed</span>
          </div>
        </div>
      </div>

      {/* Your Perks */}
      <div className="loyalty-section">
        <h3>Your {tier.label} Perks</h3>
        <ul className="benefits-list">
          {tier.perks.map((perk, i) => (
            <li key={i}>{perk}</li>
          ))}
        </ul>
        {loyalty.tier !== "chocolate" && (
          <p style={{ fontSize: "0.85rem", color: "#888", marginTop: 12 }}>
            Unlock more perks at the next tier!
          </p>
        )}
      </div>

      {/* Birthday Reward */}
      <div className="loyalty-section">
        <h3>Birthday Reward</h3>
        <p>Tell us your birthday and get a free chocolate gift each year!</p>
        {profile?.birthday ? (
          <p className="setting-note">
            Birthday set: {profile.birthday}
            {isBirthday && (
              <span style={{ color: "var(--color-green)", fontWeight: 700 }}>
                {" "}— Claim your reward at the shop today!
              </span>
            )}
          </p>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="bday">Your Birthday (MM-DD)</label>
              <input
                id="bday"
                type="text"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="03-15"
                maxLength={5}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSaveBirthday}>
              {birthdaySaved ? "Saved!" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* VIP Early Access */}
      {(loyalty.tier === "gold" || loyalty.tier === "chocolate") && (
        <div className="loyalty-section vip-section">
          <h3>VIP Early Access</h3>
          <p>As a {tier.label} member, you get early access to:</p>
          <div className="vip-perks">
            <Link href="/pre-orders" className="vip-perk-link">
              <span>{"\u{1F31F}"}</span> Pre-orders & limited releases
            </Link>
            <Link href="/collections/vip-exclusives" className="vip-perk-link">
              <span>{"\u{1F48E}"}</span> Members-only flavors
            </Link>
            <Link href="/events" className="vip-perk-link">
              <span>{"\u{1F37E}"}</span> Exclusive tasting events
            </Link>
          </div>
        </div>
      )}

      {/* Scan QR Code */}
      <div className="loyalty-section">
        <h3>Earn Points</h3>
        <p>Scan a QR code at the shop or enter a code below.</p>

        {isCameraSupported() && (
          <button className="btn btn-primary scan-btn" onClick={handleScanQR} disabled={scanning}>
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
          <p className="loyalty-message" style={{ color: messageType === "success" ? "var(--color-green)" : "var(--color-red)" }}>
            {message}
          </p>
        )}
      </div>

      {/* Rewards Tiers */}
      <div className="loyalty-section">
        <h3>Rewards Tiers</h3>
        <div className="rewards-tiers">
          {Object.entries(TIER_INFO).map(([key, info]) => (
            <div key={key} className={`reward-tier ${loyalty.tier === key ? "active" : ""}`}>
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

      {/* Quick Links */}
      <div className="loyalty-section">
        <h3>More Ways to Earn</h3>
        <div className="loyalty-links">
          <Link href="/stamps" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
            Digital Stamp Card
          </Link>
          <Link href="/quiz" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
            Flavor Quiz (+10 pts)
          </Link>
        </div>
      </div>
    </div>
  );
}
