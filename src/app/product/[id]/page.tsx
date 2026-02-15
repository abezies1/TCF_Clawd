"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { impactFeedback, notificationFeedback } from "@/lib/native/haptics";

function TastingWheel({ notes }: { notes: NonNullable<ReturnType<typeof getProductById>>["tastingNotes"] }) {
  const dimensions = [
    { key: "sweetness", label: "Sweet" },
    { key: "bitterness", label: "Bitter" },
    { key: "acidity", label: "Acidic" },
    { key: "fruitiness", label: "Fruity" },
    { key: "nuttiness", label: "Nutty" },
    { key: "spiciness", label: "Spicy" },
    { key: "creaminess", label: "Creamy" },
  ] as const;

  return (
    <div className="tasting-wheel">
      {dimensions.map((dim) => {
        const value = notes[dim.key] as number;
        return (
          <div key={dim.key} className="tasting-dimension">
            <span className="tasting-label">{dim.label}</span>
            <div className="tasting-bar-track">
              <div
                className="tasting-bar-fill"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="tasting-value">{value}/5</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductById(params.id as string);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="product-detail-page">
        <h1>Product Not Found</h1>
        <Link href="/" className="btn btn-primary">Browse Menu</Link>
      </div>
    );
  }

  async function handleAddToCart() {
    await impactFeedback("MEDIUM");
    addItem({
      variantId: product!.id,
      productId: product!.id,
      name: product!.name,
      variantTitle: "Default Title",
      price: product!.price,
    });
    await notificationFeedback();
  }

  return (
    <div className="product-detail-page">
      <Link href="/" className="back-link">&larr; Back to Menu</Link>

      <div className="product-detail-header">
        <div className="product-detail-image">
          {product.isNew && <span className="product-badge badge-new">New</span>}
          {product.isLimited && <span className="product-badge badge-limited">Limited</span>}
          {product.isMembersOnly && <span className="product-badge badge-vip">Members Only</span>}
          {"\u{1F36B}"}
        </div>

        <div className="product-detail-info">
          <div className="product-category">{product.category}</div>
          <h1>{product.name}</h1>

          <div className="product-meta">
            {product.cacaoPercentage && (
              <span className="meta-tag">{product.cacaoPercentage}% Cacao</span>
            )}
            <span className="meta-tag">{product.weight}</span>
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="meta-tag">{tag}</span>
            ))}
          </div>

          <p className="product-long-desc">{product.longDescription}</p>

          <div className="product-detail-price">
            <span className="product-price" style={{ fontSize: "1.5rem" }}>
              {formatPrice(product.price)}
            </span>
            {product.availableQuantity && (
              <span className="stock-info">
                Only {product.availableQuantity} available
              </span>
            )}
          </div>

          {product.isPreOrder ? (
            <div className="preorder-info">
              <p>Available {product.preOrderDate}</p>
              <Link href="/pre-orders" className="btn btn-primary" style={{ width: "100%" }}>
                Pre-Order Now
              </Link>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Tasting Notes */}
      <div className="detail-section">
        <h2>Tasting Notes</h2>
        <div className="tasting-content">
          <TastingWheel notes={product.tastingNotes} />
          <div className="tasting-details">
            <div className="tasting-info-row">
              <strong>Intensity:</strong> {"\u{1F525}".repeat(product.tastingNotes.intensity)}
            </div>
            <div className="tasting-info-row">
              <strong>Primary Flavors:</strong> {product.tastingNotes.primaryFlavors.join(", ")}
            </div>
            <div className="tasting-info-row">
              <strong>Finish:</strong> {product.tastingNotes.finishNotes}
            </div>
          </div>
        </div>
      </div>

      {/* Origin Story */}
      {product.origin && (
        <div className="detail-section origin-section">
          <h2>Origin Story</h2>
          <div className="origin-card">
            <div className="origin-meta">
              <div className="origin-meta-item">
                <span className="origin-label">Region</span>
                <span>{product.origin.region}, {product.origin.country}</span>
              </div>
              {product.origin.farm && (
                <div className="origin-meta-item">
                  <span className="origin-label">Farm</span>
                  <span>{product.origin.farm}</span>
                </div>
              )}
              <div className="origin-meta-item">
                <span className="origin-label">Variety</span>
                <span>{product.origin.cacaoVariety}</span>
              </div>
              {product.origin.altitude && (
                <div className="origin-meta-item">
                  <span className="origin-label">Altitude</span>
                  <span>{product.origin.altitude}</span>
                </div>
              )}
              <div className="origin-meta-item">
                <span className="origin-label">Harvest</span>
                <span>{product.origin.harvestSeason}</span>
              </div>
            </div>
            <p className="origin-story">{product.origin.story}</p>
          </div>
        </div>
      )}

      {/* Pairing Suggestions */}
      <div className="detail-section">
        <h2>Pairing Suggestions</h2>
        <div className="pairings-grid">
          {product.pairings.map((pairing, i) => (
            <div key={i} className="pairing-card">
              <span className="pairing-icon">
                {pairing.category === "wine" ? "\u{1F377}" :
                 pairing.category === "coffee" ? "\u{2615}" :
                 pairing.category === "spirits" ? "\u{1F943}" :
                 pairing.category === "cheese" ? "\u{1F9C0}" : "\u{1F37D}"}
              </span>
              <div className="pairing-info">
                <strong>{pairing.name}</strong>
                <p>{pairing.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients & Allergens */}
      <div className="detail-section">
        <h2>Ingredients</h2>
        <p className="ingredient-list">{product.ingredients.join(", ")}</p>
        {product.allergens.length > 0 && (
          <p className="allergen-info">
            <strong>Allergens:</strong> Contains {product.allergens.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
