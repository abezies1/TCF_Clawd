"use client";

import { useState } from "react";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="hero">
        <h1>Tucson Chocolate Factory</h1>
        <p>
          Handcrafted chocolates made in the heart of Tucson. Order online,
          pick up at the shop.
        </p>
      </div>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
