"use client";

import { useState } from "react";
import { Product, categories } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { impactFeedback } from "@/lib/native/haptics";

export default function FallbackMenu({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addItem } = useCart();

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
          <div key={product.id} className="product-card">
            <div className="product-image">{"\u{1F36B}"}</div>
            <div className="product-info">
              <div className="product-category">{product.category}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-desc">{product.description}</div>
              <div className="product-footer">
                <span className="product-price">
                  {formatPrice(product.price)}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    impactFeedback("LIGHT");
                    addItem({
                      variantId: product.id,
                      productId: product.id,
                      name: product.name,
                      variantTitle: "Default Title",
                      price: product.price,
                    });
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
