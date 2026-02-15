"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getUserProfile,
  saveUserProfile,
  UserProfile,
  getNotificationPrefs,
  saveNotificationPrefs,
  NotificationPrefs,
} from "@/lib/storage";
import {
  checkBiometricAvailability,
  registerBiometric,
  hasBiometricCredentials,
  clearBiometricCredentials,
  getBiometricUserName,
} from "@/lib/native/biometrics";
import { registerPushNotifications } from "@/lib/native/notifications";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(
    getNotificationPrefs()
  );
  const [saved, setSaved] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState("");

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setName(p.name);
      setEmail(p.email);
      setPhone(p.phone);
    }

    checkBiometricAvailability().then(setBiometricsAvailable);
    setBiometricsEnabled(hasBiometricCredentials());
    setNotifPrefs(getNotificationPrefs());
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await impactFeedback("LIGHT");

    const updatedProfile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      biometricsEnabled,
      notificationsEnabled: notifPrefs.orderUpdates || notifPrefs.promotions,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setSaved(true);
    await notificationFeedback();
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleToggleBiometrics() {
    if (biometricsEnabled) {
      clearBiometricCredentials();
      setBiometricsEnabled(false);
      setBiometricStatus("Biometrics disabled");
    } else {
      const userId = email || `user_${Date.now()}`;
      const userName = name || "TCF Customer";
      const result = await registerBiometric(userId, userName);
      if (result.success) {
        setBiometricsEnabled(true);
        setBiometricStatus("Biometrics enabled successfully!");
        await notificationFeedback();
      } else {
        setBiometricStatus(result.error || "Failed to enable biometrics");
      }
    }
    setTimeout(() => setBiometricStatus(""), 3000);
  }

  async function handleEnableNotifications() {
    const token = await registerPushNotifications();
    if (token) {
      setNotifPrefs((prev) => {
        const updated = { ...prev, orderUpdates: true };
        saveNotificationPrefs(updated);
        return updated;
      });
      await notificationFeedback();
    }
  }

  function handleNotifPrefChange(
    key: keyof NotificationPrefs,
    value: boolean
  ) {
    setNotifPrefs((prev) => {
      const updated = { ...prev, [key]: value };
      saveNotificationPrefs(updated);
      return updated;
    });
  }

  return (
    <div className="account-page">
      <h1>Account & Settings</h1>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile}>
        <div className="account-section">
          <h3>Profile Information</h3>
          <p className="section-desc">
            Save your info for faster checkout.
          </p>
          <div className="form-group">
            <label htmlFor="acct-name">Full Name</label>
            <input
              id="acct-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="acct-email">Email</label>
              <input
                id="acct-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="acct-phone">Phone</label>
              <input
                id="acct-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(520) 555-0123"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
            {saved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Biometric Authentication */}
      <div className="account-section">
        <h3>Security</h3>
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">
              Face ID / Touch ID
            </span>
            <span className="setting-desc">
              {biometricsAvailable
                ? "Use biometrics for quick reorders"
                : "Not available on this device"}
            </span>
          </div>
          <button
            className={`toggle-btn ${biometricsEnabled ? "active" : ""}`}
            onClick={handleToggleBiometrics}
            disabled={!biometricsAvailable}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {biometricsEnabled && (
          <p className="setting-note">
            Signed in as: {getBiometricUserName() || "Unknown"}
          </p>
        )}
        {biometricStatus && (
          <p className="setting-note">{biometricStatus}</p>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="account-section">
        <h3>Notifications</h3>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Order Updates</span>
            <span className="setting-desc">
              Get notified when your order is ready
            </span>
          </div>
          <button
            className={`toggle-btn ${notifPrefs.orderUpdates ? "active" : ""}`}
            onClick={() => {
              if (!notifPrefs.orderUpdates) handleEnableNotifications();
              handleNotifPrefChange("orderUpdates", !notifPrefs.orderUpdates);
            }}
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Promotions & Specials</span>
            <span className="setting-desc">
              Weekly deals and seasonal flavors
            </span>
          </div>
          <button
            className={`toggle-btn ${notifPrefs.promotions ? "active" : ""}`}
            onClick={() => {
              if (!notifPrefs.promotions) handleEnableNotifications();
              handleNotifPrefChange("promotions", !notifPrefs.promotions);
            }}
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Arrival Alerts</span>
            <span className="setting-desc">
              Auto-notify shop when you arrive for curbside
            </span>
          </div>
          <button
            className={`toggle-btn ${notifPrefs.arrivalAlerts ? "active" : ""}`}
            onClick={() =>
              handleNotifPrefChange("arrivalAlerts", !notifPrefs.arrivalAlerts)
            }
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="account-section">
        <h3>Quick Links</h3>
        <div className="quick-links">
          <Link href="/orders" className="quick-link">
            <span className="quick-link-icon">&#128230;</span>
            <span>Order History</span>
          </Link>
          <Link href="/loyalty" className="quick-link">
            <span className="quick-link-icon">&#11088;</span>
            <span>Loyalty Rewards</span>
          </Link>
          <Link href="/" className="quick-link">
            <span className="quick-link-icon">&#127851;</span>
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
