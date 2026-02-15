"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          Tucson Chocolate Factory <span>| Order & Pickup</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav desktop-nav">
          <Link href="/">Menu</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/build-box">Build a Box</Link>
          <Link href="/events">Events</Link>
          <Link href="/gifting">Gifts</Link>
          <Link href="/loyalty">Rewards</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <Link href="/cart" className="cart-badge">
            Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </nav>

        {/* Mobile: Cart + Hamburger */}
        <div className="mobile-nav-controls">
          <Link href="/cart" className="cart-badge">
            Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-section">
            <span className="mobile-menu-label">Shop</span>
            <Link href="/">Browse Menu</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/build-box">Build Your Box</Link>
            <Link href="/subscriptions">Subscriptions</Link>
            <Link href="/pre-orders">Pre-Orders</Link>
          </div>
          <div className="mobile-menu-section">
            <span className="mobile-menu-label">Experience</span>
            <Link href="/quiz">Flavor Quiz</Link>
            <Link href="/events">Events & Tastings</Link>
            <Link href="/behind-the-scenes">Behind the Scenes</Link>
          </div>
          <div className="mobile-menu-section">
            <span className="mobile-menu-label">Rewards & Gifts</span>
            <Link href="/loyalty">Loyalty Rewards</Link>
            <Link href="/stamps">Stamp Card</Link>
            <Link href="/gifting">Send a Gift</Link>
          </div>
          <div className="mobile-menu-section">
            <span className="mobile-menu-label">Account</span>
            <Link href="/orders">Order History</Link>
            <Link href="/account">Settings</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
