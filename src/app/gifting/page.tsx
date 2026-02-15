"use client";

import { useState } from "react";
import Link from "next/link";
import { richProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";
import { scheduleLocalNotification } from "@/lib/native/notifications";

const giftableProducts = richProducts.filter(
  (p) => !p.isPreOrder && !p.isMembersOnly && (p.category === "gifts" || p.category === "truffles" || p.category === "bars")
);

type GiftTab = "digital" | "scheduled" | "corporate";

export default function GiftingPage() {
  const [tab, setTab] = useState<GiftTab>("digital");

  // Digital gift state
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [giftSent, setGiftSent] = useState(false);

  // Scheduled delivery state
  const [schedDate, setSchedDate] = useState("");
  const [schedOccasion, setSchedOccasion] = useState("");

  // Corporate state
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [corpSubmitted, setCorpSubmitted] = useState(false);

  async function handleSendDigitalGift(e: React.FormEvent) {
    e.preventDefault();
    await notificationFeedback();
    setGiftSent(true);
    await scheduleLocalNotification(
      "Gift sent!",
      `Your chocolate gift is on its way to ${recipientName}!`
    );
  }

  async function handleScheduleGift(e: React.FormEvent) {
    e.preventDefault();
    await notificationFeedback();
    setGiftSent(true);
    await scheduleLocalNotification(
      "Gift scheduled!",
      `Your gift will be delivered on ${schedDate}.`
    );
  }

  async function handleCorporateSubmit(e: React.FormEvent) {
    e.preventDefault();
    await notificationFeedback();
    setCorpSubmitted(true);
  }

  if (giftSent) {
    return (
      <div className="gifting-page">
        <div className="confirmation-box">
          <div className="confirmation-check">&#10003;</div>
          <h1>Gift {tab === "scheduled" ? "Scheduled" : "Sent"}!</h1>
          <p>
            {tab === "digital"
              ? `We've sent a digital gift notification to ${recipientEmail}. They'll receive a beautiful email with your personal message.`
              : `Your gift is scheduled for delivery on ${schedDate}. We'll send you a confirmation email.`}
          </p>
          <button className="btn btn-primary" onClick={() => setGiftSent(false)} style={{ marginTop: 16 }}>
            Send Another Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gifting-page">
      <div className="hero">
        <h1>Send Chocolate Love</h1>
        <p>
          Send a digital gift, schedule a delivery, or set up corporate gifting.
        </p>
      </div>

      {/* Tab selector */}
      <div className="gift-tabs">
        <button
          className={`gift-tab ${tab === "digital" ? "active" : ""}`}
          onClick={() => setTab("digital")}
        >
          Digital Gift
        </button>
        <button
          className={`gift-tab ${tab === "scheduled" ? "active" : ""}`}
          onClick={() => setTab("scheduled")}
        >
          Schedule Delivery
        </button>
        <button
          className={`gift-tab ${tab === "corporate" ? "active" : ""}`}
          onClick={() => setTab("corporate")}
        >
          Corporate
        </button>
      </div>

      {/* Digital Gift */}
      {tab === "digital" && (
        <form onSubmit={handleSendDigitalGift} className="gift-form">
          <div className="gift-section">
            <h2>Choose a Gift</h2>
            <div className="gift-product-grid">
              {giftableProducts.map((product) => (
                <label
                  key={product.id}
                  className={`gift-product-option ${selectedProduct === product.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="giftProduct"
                    value={product.id}
                    checked={selectedProduct === product.id}
                    onChange={() => {
                      setSelectedProduct(product.id);
                      impactFeedback("LIGHT");
                    }}
                  />
                  <div className="gift-product-content">
                    <span className="gift-product-name">{product.name}</span>
                    <span className="gift-product-price">{formatPrice(product.price)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="gift-section">
            <h2>Personalize Your Gift</h2>
            <div className="form-group">
              <label htmlFor="gift-sender">Your Name</label>
              <input id="gift-sender" type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gift-rcpt-name">Recipient&apos;s Name</label>
                <input id="gift-rcpt-name" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" required />
              </div>
              <div className="form-group">
                <label htmlFor="gift-rcpt-email">Recipient&apos;s Email</label>
                <input id="gift-rcpt-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="their@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="gift-message">Personal Message</label>
              <textarea
                id="gift-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a heartfelt message..."
                rows={4}
              />
            </div>
          </div>

          {/* Preview */}
          {selectedProduct && recipientName && (
            <div className="gift-preview">
              <div className="gift-preview-card">
                <div className="gift-preview-header">A Chocolate Gift for You</div>
                <p className="gift-preview-to">Dear {recipientName},</p>
                <p className="gift-preview-message">{message || "Enjoy some handcrafted chocolates from Tucson!"}</p>
                <p className="gift-preview-from">With love, {senderName || "A friend"}</p>
                <div className="gift-preview-product">
                  {giftableProducts.find((p) => p.id === selectedProduct)?.name}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={!selectedProduct}>
            Send Digital Gift
          </button>
        </form>
      )}

      {/* Scheduled Delivery */}
      {tab === "scheduled" && (
        <form onSubmit={handleScheduleGift} className="gift-form">
          <div className="gift-section">
            <h2>Schedule a Delivery</h2>
            <p className="section-desc">
              Choose a date and we&apos;ll deliver handcrafted chocolates right on time.
            </p>
            <div className="form-group">
              <label htmlFor="sched-product">Select Gift</label>
              <select id="sched-product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                <option value="">Choose a product...</option>
                {giftableProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sched-date">Delivery Date</label>
                <input id="sched-date" type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="sched-occasion">Occasion</label>
                <select id="sched-occasion" value={schedOccasion} onChange={(e) => setSchedOccasion(e.target.value)}>
                  <option value="">Select occasion...</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="valentines">Valentine&apos;s Day</option>
                  <option value="mothers-day">Mother&apos;s Day</option>
                  <option value="fathers-day">Father&apos;s Day</option>
                  <option value="christmas">Christmas</option>
                  <option value="thank-you">Thank You</option>
                  <option value="just-because">Just Because</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sched-name">Recipient Name</label>
                <input id="sched-name" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="sched-email">Recipient Email</label>
                <input id="sched-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sched-message">Gift Message</label>
              <textarea id="sched-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Happy Birthday! Enjoy these chocolates..." />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={!selectedProduct || !schedDate}>
            Schedule Delivery
          </button>
        </form>
      )}

      {/* Corporate Gifting */}
      {tab === "corporate" && (
        <div className="gift-form">
          {corpSubmitted ? (
            <div className="confirmation-box" style={{ marginTop: 0 }}>
              <div className="confirmation-check">&#10003;</div>
              <h2>Request Received!</h2>
              <p>We&apos;ll contact {companyEmail} within 24 hours with a custom quote and options.</p>
            </div>
          ) : (
            <>
              <div className="gift-section">
                <h2>Corporate Gifting</h2>
                <p className="section-desc">
                  Impress clients, reward employees, or celebrate milestones with
                  handcrafted chocolates. Custom branding and bulk pricing available.
                </p>

                <div className="corporate-perks">
                  <div className="perk-item">
                    <span className="perk-icon">{"\u{1F381}"}</span>
                    <span>Custom branded packaging</span>
                  </div>
                  <div className="perk-item">
                    <span className="perk-icon">{"\u{1F4B0}"}</span>
                    <span>Bulk pricing (10+ orders)</span>
                  </div>
                  <div className="perk-item">
                    <span className="perk-icon">{"\u{1F4E6}"}</span>
                    <span>Direct shipping to recipients</span>
                  </div>
                  <div className="perk-item">
                    <span className="perk-icon">{"\u{1F4CB}"}</span>
                    <span>Dedicated account manager</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCorporateSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="corp-name">Company Name</label>
                    <input id="corp-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="corp-email">Contact Email</label>
                    <input id="corp-email" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="corp-qty">Estimated Quantity</label>
                  <select id="corp-qty" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                    <option value="10">10-25 gifts</option>
                    <option value="25">25-50 gifts</option>
                    <option value="50">50-100 gifts</option>
                    <option value="100">100+ gifts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="corp-notes">Tell us about your needs</label>
                  <textarea id="corp-notes" rows={4} placeholder="What's the occasion? Any branding requirements? Budget range?" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Request a Quote
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="gift-bottom-links">
        <Link href="/subscriptions" className="btn btn-secondary">
          Gift a Subscription
        </Link>
        <Link href="/build-box" className="btn btn-secondary">
          Build a Custom Box
        </Link>
      </div>
    </div>
  );
}
