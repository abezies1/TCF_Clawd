"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";

const categoryEmoji: Record<string, string> = {
  truffles: "\u{1F36B}",
  bars: "\u{1F36B}",
  barks: "\u{1F36B}",
  drinks: "\u2615",
  gifts: "\u{1F381}",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <div className="product-image">
        {categoryEmoji[product.category] || "\u{1F36B}"}
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn btn-primary"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
