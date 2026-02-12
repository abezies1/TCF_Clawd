"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          Tucson Chocolate Factory <span>| Order & Pickup</span>
        </Link>
        <nav className="header-nav">
          <Link href="/">Menu</Link>
          <Link href="/cart" className="cart-badge">
            Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
