"use client";

import { useState } from "react";
import { ShopifyProduct, ShopifyCollection } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

interface MenuContentProps {
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function MenuContent({ products, collections }: MenuContentProps) {
  const [activeType, setActiveType] = useState("all");

  // Build category filter from product types
  const productTypes = Array.from(
    new Set(products.map((p) => p.productType).filter(Boolean))
  );

  const filtered =
    activeType === "all"
      ? products
      : products.filter((p) => p.productType === activeType);

  return (
    <>
      <div className="hero">
        <h1>Tucson Chocolate Factory</h1>
        <p>
          Handcrafted chocolates made in the heart of Tucson. Order online,
          pick up at the shop.
        </p>
      </div>

      {productTypes.length > 1 && (
        <div className="category-filter">
          <button
            className={`category-btn ${activeType === "all" ? "active" : ""}`}
            onClick={() => setActiveType("all")}
          >
            All
          </button>
          {productTypes.map((type) => (
            <button
              key={type}
              className={`category-btn ${activeType === type ? "active" : ""}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", padding: 48, color: "#888" }}>
          No products found. Check back soon!
        </p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
