"use client";

import { useState } from "react";
import { subscriptionTiers, SubscriptionTier } from "@/lib/catalog";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";
import { getUserProfile } from "@/lib/storage";

export default function SubscriptionsPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const profile = typeof window !== "undefined" ? getUserProfile() : null;

  async function handleSelectTier(tier: SubscriptionTier) {
    await impactFeedback("MEDIUM");
    setSelectedTier(tier.id);
    setShowSignup(true);
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await notificationFeedback();
    setSubmitted(true);
  }

  if (submitted) {
    const tier = subscriptionTiers.find((t) => t.id === selectedTier);
    return (
      <div className="subscriptions-page">
        <div className="confirmation-box">
          <div className="confirmation-check">&#10003;</div>
          <h1>You&apos;re In!</h1>
          <p>
            Welcome to <strong>{tier?.name}</strong>. We&apos;ll send your first
            box details to <strong>{email}</strong>.
          </p>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: 16 }}>
            Your first box ships within 5 business days. You can manage your
            subscription anytime from your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="hero">
        <h1>Chocolate Subscriptions</h1>
        <p>
          Handcrafted chocolates delivered to your door. Each box is a curated
          journey through flavor.
        </p>
      </div>

      <div className="subscription-tiers">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`subscription-card ${tier.popular ? "popular" : ""} ${
              selectedTier === tier.id ? "selected" : ""
            }`}
          >
            {tier.popular && <div className="popular-badge">Most Popular</div>}
            <h2>{tier.name}</h2>
            <div className="sub-price">
              <span className="sub-price-amount">{formatPrice(tier.price)}</span>
              <span className="sub-price-interval">/{tier.interval === "monthly" ? "month" : "quarter"}</span>
            </div>
            <p className="sub-desc">{tier.description}</p>
            <ul className="sub-includes">
              {tier.includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="sub-savings">{tier.savings}</p>
            <button
              className={`btn ${selectedTier === tier.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleSelectTier(tier)}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {selectedTier === tier.id ? "Selected" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Signup Form */}
      {showSignup && (
        <div className="sub-signup">
          <h2>Start Your Subscription</h2>
          <p>
            Selected:{" "}
            <strong>
              {subscriptionTiers.find((t) => t.id === selectedTier)?.name}
            </strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sub-name">Full Name</label>
                <input
                  id="sub-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sub-email">Email</label>
                <input
                  id="sub-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
              Subscribe Now
            </button>
          </form>
        </div>
      )}

      {/* FAQ */}
      <div className="sub-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Can I cancel anytime?</h3>
          <p>Yes! No commitment, no penalties. Cancel or pause from your account settings.</p>
        </div>
        <div className="faq-item">
          <h3>When does my box ship?</h3>
          <p>Monthly boxes ship on the 1st of each month. Quarterly boxes ship March, June, September, and December.</p>
        </div>
        <div className="faq-item">
          <h3>Can I gift a subscription?</h3>
          <p>Absolutely! Choose any plan and select &ldquo;Gift this subscription&rdquo; at checkout.</p>
        </div>
        <div className="faq-item">
          <h3>What if I have allergies?</h3>
          <p>Let us know your allergens and we&apos;ll customize your box. All our products are clearly labeled.</p>
        </div>
      </div>
    </div>
  );
}
