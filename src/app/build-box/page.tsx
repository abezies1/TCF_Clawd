"use client";

import { useState } from "react";
import Link from "next/link";
import { richProducts, RichProduct } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";

const BOX_SIZES = [
  { count: 6, label: "Small Box (6 pieces)", price: 24.99, discount: "Save 10%" },
  { count: 12, label: "Medium Box (12 pieces)", price: 44.99, discount: "Save 15%" },
  { count: 24, label: "Large Box (24 pieces)", price: 79.99, discount: "Save 20%" },
];

const selectableProducts = richProducts.filter(
  (p) =>
    !p.isPreOrder &&
    !p.isMembersOnly &&
    (p.category === "truffles" || p.category === "bars" || p.category === "barks")
);

interface BoxSelection {
  product: RichProduct;
  quantity: number;
}

export default function BuildBoxPage() {
  const [boxSize, setBoxSize] = useState(BOX_SIZES[0]);
  const [selections, setSelections] = useState<BoxSelection[]>([]);
  const { addItem } = useCart();

  const totalSelected = selections.reduce((sum, s) => sum + s.quantity, 0);
  const remaining = boxSize.count - totalSelected;

  async function addPiece(product: RichProduct) {
    if (remaining <= 0) return;
    await impactFeedback("LIGHT");

    setSelections((prev) => {
      const existing = prev.find((s) => s.product.id === product.id);
      if (existing) {
        return prev.map((s) =>
          s.product.id === product.id
            ? { ...s, quantity: s.quantity + 1 }
            : s
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removePiece(productId: string) {
    setSelections((prev) =>
      prev
        .map((s) =>
          s.product.id === productId
            ? { ...s, quantity: s.quantity - 1 }
            : s
        )
        .filter((s) => s.quantity > 0)
    );
  }

  async function handleAddBoxToCart() {
    await notificationFeedback();
    const description = selections
      .map((s) => `${s.product.name} x${s.quantity}`)
      .join(", ");

    addItem({
      variantId: `custom-box-${Date.now()}`,
      productId: "custom-box",
      name: `Custom Box (${boxSize.count} pieces)`,
      variantTitle: description,
      price: boxSize.price,
    });
  }

  return (
    <div className="build-box-page">
      <div className="hero">
        <h1>Build Your Own Box</h1>
        <p>Pick your favorites and create the perfect custom chocolate box.</p>
      </div>

      {/* Box Size Selector */}
      <div className="box-size-selector">
        {BOX_SIZES.map((size) => (
          <button
            key={size.count}
            className={`box-size-option ${boxSize.count === size.count ? "active" : ""}`}
            onClick={() => {
              setBoxSize(size);
              setSelections([]);
            }}
          >
            <span className="box-size-label">{size.label}</span>
            <span className="box-size-price">{formatPrice(size.price)}</span>
            <span className="box-size-discount">{size.discount}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="box-progress">
        <div className="box-progress-bar">
          <div
            className="box-progress-fill"
            style={{ width: `${(totalSelected / boxSize.count) * 100}%` }}
          />
        </div>
        <span className="box-progress-text">
          {totalSelected} / {boxSize.count} pieces selected
          {remaining > 0 ? ` — ${remaining} more to go` : " — Box complete!"}
        </span>
      </div>

      <div className="build-box-layout">
        {/* Product Picker */}
        <div className="box-picker">
          <h2>Choose Your Chocolates</h2>
          <div className="box-products">
            {selectableProducts.map((product) => {
              const inBox = selections.find((s) => s.product.id === product.id);
              return (
                <div key={product.id} className="box-product-item">
                  <div className="box-product-info">
                    <span className="box-product-name">{product.name}</span>
                    <span className="box-product-desc">{product.description}</span>
                    {product.tastingNotes.primaryFlavors.length > 0 && (
                      <div className="product-flavors" style={{ marginTop: 4 }}>
                        {product.tastingNotes.primaryFlavors.slice(0, 2).map((f) => (
                          <span key={f} className="flavor-tag">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="box-product-controls">
                    {inBox && (
                      <>
                        <button
                          className="quantity-btn"
                          onClick={() => removePiece(product.id)}
                        >
                          &minus;
                        </button>
                        <span className="quantity-num">{inBox.quantity}</span>
                      </>
                    )}
                    <button
                      className="quantity-btn"
                      onClick={() => addPiece(product)}
                      disabled={remaining <= 0}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box Preview */}
        <div className="box-preview">
          <h2>Your Box</h2>
          {selections.length === 0 ? (
            <p className="box-empty">Start adding chocolates to see your box here.</p>
          ) : (
            <div className="box-preview-items">
              {selections.map((s) => (
                <div key={s.product.id} className="box-preview-item">
                  <span>{s.product.name}</span>
                  <span>x{s.quantity}</span>
                </div>
              ))}
            </div>
          )}

          <div className="box-preview-total">
            <span>Total</span>
            <span>{formatPrice(boxSize.price)}</span>
          </div>

          {remaining === 0 ? (
            <button
              className="btn btn-primary"
              onClick={handleAddBoxToCart}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Add Box to Cart
            </button>
          ) : (
            <p className="box-empty" style={{ fontSize: "0.85rem" }}>
              Select {remaining} more piece{remaining > 1 ? "s" : ""} to complete your box.
            </p>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/cart" className="btn btn-secondary">View Cart</Link>
      </div>
    </div>
  );
}
