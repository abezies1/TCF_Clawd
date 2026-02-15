"use client";

import { useState, useEffect } from "react";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";
import { scheduleLocalNotification } from "@/lib/native/notifications";

interface StampCardData {
  stamps: number;
  totalRedeemed: number;
  history: { date: string; type: "stamp" | "reward" }[];
}

const STAMPS_FOR_REWARD = 10;
const STORAGE_KEY = "tcf_stamp_card";

function getStampData(): StampCardData {
  if (typeof localStorage === "undefined") {
    return { stamps: 0, totalRedeemed: 0, history: [] };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { stamps: 0, totalRedeemed: 0, history: [] };
  } catch {
    return { stamps: 0, totalRedeemed: 0, history: [] };
  }
}

function saveStampData(data: StampCardData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function StampCardPage() {
  const [data, setData] = useState<StampCardData>(getStampData());
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    setData(getStampData());
  }, []);

  const canRedeem = data.stamps >= STAMPS_FOR_REWARD;

  async function addStamp() {
    await impactFeedback("MEDIUM");
    const updated = {
      ...data,
      stamps: data.stamps + 1,
      history: [...data.history, { date: new Date().toISOString(), type: "stamp" as const }],
    };
    saveStampData(updated);
    setData(updated);

    if (updated.stamps >= STAMPS_FOR_REWARD) {
      await scheduleLocalNotification(
        "You earned a free truffle!",
        "Your stamp card is full. Redeem at your next visit!"
      );
    }
  }

  async function redeemReward() {
    if (!canRedeem) return;
    await notificationFeedback();
    const updated = {
      stamps: data.stamps - STAMPS_FOR_REWARD,
      totalRedeemed: data.totalRedeemed + 1,
      history: [...data.history, { date: new Date().toISOString(), type: "reward" as const }],
    };
    saveStampData(updated);
    setData(updated);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  }

  // Visual stamp card grid
  const stampSlots = Array.from({ length: STAMPS_FOR_REWARD }, (_, i) => i);

  return (
    <div className="stamps-page">
      <div className="hero">
        <h1>Digital Stamp Card</h1>
        <p>Earn a stamp with every in-store visit. {STAMPS_FOR_REWARD} stamps = free truffle!</p>
      </div>

      {/* Stamp Card */}
      <div className="stamp-card">
        <div className="stamp-card-header">
          <h2>Tucson Chocolate Factory</h2>
          <span className="stamp-card-subtitle">Loyalty Stamp Card</span>
        </div>

        <div className="stamp-grid">
          {stampSlots.map((i) => (
            <div
              key={i}
              className={`stamp-slot ${i < data.stamps ? "stamped" : ""}`}
            >
              {i < data.stamps ? "\u{1F36B}" : String(i + 1)}
            </div>
          ))}
        </div>

        <div className="stamp-card-progress">
          {canRedeem ? (
            <p className="stamp-ready">Your card is full! Redeem your free truffle.</p>
          ) : (
            <p>{STAMPS_FOR_REWARD - data.stamps} more stamps until your free truffle</p>
          )}
        </div>

        <div className="stamp-card-actions">
          <button className="btn btn-secondary" onClick={addStamp}>
            Add Stamp (In-Store)
          </button>
          <button
            className={`btn ${canRedeem ? "btn-primary" : "btn-secondary"}`}
            onClick={redeemReward}
            disabled={!canRedeem}
          >
            Redeem Reward
          </button>
        </div>
      </div>

      {/* Reward popup */}
      {showReward && (
        <div className="reward-popup">
          <div className="reward-popup-content">
            <span className="reward-icon">{"\u{1F389}"}</span>
            <h2>Free Truffle Unlocked!</h2>
            <p>Show this screen at the shop to claim your reward.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stamp-stats">
        <div className="stamp-stat">
          <span className="stamp-stat-num">{data.stamps}</span>
          <span className="stamp-stat-label">Current Stamps</span>
        </div>
        <div className="stamp-stat">
          <span className="stamp-stat-num">{data.totalRedeemed}</span>
          <span className="stamp-stat-label">Rewards Redeemed</span>
        </div>
        <div className="stamp-stat">
          <span className="stamp-stat-num">{data.history.filter((h) => h.type === "stamp").length}</span>
          <span className="stamp-stat-label">Total Visits</span>
        </div>
      </div>

      {/* Recent history */}
      {data.history.length > 0 && (
        <div className="stamp-history">
          <h3>Recent Activity</h3>
          {data.history.slice(-10).reverse().map((entry, i) => (
            <div key={i} className="stamp-history-item">
              <span>{entry.type === "stamp" ? "\u{2B50} Stamp earned" : "\u{1F381} Reward redeemed"}</span>
              <span className="stamp-history-date">
                {new Date(entry.date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
