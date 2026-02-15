"use client";

import { useState } from "react";
import { events, TCFEvent } from "@/lib/catalog";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";
import { scheduleLocalNotification } from "@/lib/native/notifications";
import { getUserProfile } from "@/lib/storage";

type EventFilter = "all" | "tasting" | "class" | "private" | "special";

export default function EventsPage() {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [bookingEvent, setBookingEvent] = useState<TCFEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("1");
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  function startBooking(event: TCFEvent) {
    const profile = getUserProfile();
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
    setBookingEvent(event);
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingEvent) return;
    await notificationFeedback();
    setBooked((prev) => new Set(prev).add(bookingEvent.id));
    setBookingEvent(null);
    await scheduleLocalNotification(
      "Event booked!",
      `You're confirmed for "${bookingEvent.title}" on ${bookingEvent.date}.`
    );
  }

  return (
    <div className="events-page">
      <div className="hero">
        <h1>Events & Experiences</h1>
        <p>
          Tastings, workshops, and private events at our Congress Street shop.
        </p>
      </div>

      {/* Filter */}
      <div className="category-filter">
        {(["all", "tasting", "class", "private", "special"] as const).map((f) => (
          <button
            key={f}
            className={`category-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Events" : f === "tasting" ? "Tastings" : f === "class" ? "Workshops" : f === "private" ? "Private" : "Special"}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="events-grid">
        {filtered.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-card-image">
              <span className="event-type-badge">{event.type}</span>
              <div className="event-placeholder">
                {event.type === "tasting" ? "\u{1F377}" :
                 event.type === "class" ? "\u{1F9D1}\u{200D}\u{1F373}" :
                 event.type === "private" ? "\u{1F389}" : "\u{2B50}"}
              </div>
            </div>
            <div className="event-card-info">
              <h3>{event.title}</h3>
              <p className="event-desc">{event.description}</p>

              <div className="event-meta">
                <div className="event-meta-item">
                  <span className="event-meta-label">Date</span>
                  <span>{event.date === "By appointment" ? event.date :
                    new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                </div>
                <div className="event-meta-item">
                  <span className="event-meta-label">Time</span>
                  <span>{event.time}</span>
                </div>
                <div className="event-meta-item">
                  <span className="event-meta-label">Duration</span>
                  <span>{event.duration}</span>
                </div>
                <div className="event-meta-item">
                  <span className="event-meta-label">Price</span>
                  <span>{formatPrice(event.price)}/person</span>
                </div>
              </div>

              <div className="event-includes">
                <strong>Includes:</strong>
                <ul>
                  {event.includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="event-card-footer">
                <div className="event-spots">
                  {event.spotsRemaining > 0 ? (
                    <span className={event.spotsRemaining <= 5 ? "spots-low" : ""}>
                      {event.spotsRemaining} spots left
                    </span>
                  ) : (
                    <span className="spots-none">Sold out</span>
                  )}
                </div>
                {booked.has(event.id) ? (
                  <span className="reserved-badge">Booked!</span>
                ) : event.spotsRemaining > 0 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => startBooking(event)}
                  >
                    Book Now
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingEvent && (
        <div className="modal-overlay" onClick={() => setBookingEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBookingEvent(null)}>
              &times;
            </button>
            <h2>Book: {bookingEvent.title}</h2>
            <p>
              {bookingEvent.date === "By appointment" ? "Date to be arranged" :
                new Date(bookingEvent.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {" "}at {bookingEvent.time}
            </p>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label htmlFor="book-name">Name</label>
                <input id="book-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="book-email">Email</label>
                <input id="book-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="book-guests">Number of Guests</label>
                <select id="book-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {Array.from({ length: Math.min(bookingEvent.spotsRemaining, 10) }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>{i + 1} guest{i > 0 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div className="modal-total">
                <span>Total</span>
                <span>{formatPrice(bookingEvent.price * parseInt(guests))}</span>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
