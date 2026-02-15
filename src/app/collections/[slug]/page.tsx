"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug, getProductsForCollection } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/orders";
import { impactFeedback } from "@/lib/native/haptics";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const collection = getCollectionBySlug(slug);
  const products = getProductsForCollection(slug);
  const { addItem } = useCart();

  if (!collection) {
    return (
      <div className="collections-page">
        <h1>Collection Not Found</h1>
        <Link href="/collections" className="btn btn-primary">
          Browse Collections
        </Link>
      </div>
    );
  }

  async function handleAddToCart(product: typeof products[0]) {
    await impactFeedback("LIGHT");
    addItem({
      variantId: product.id,
      productId: product.id,
      name: product.name,
      variantTitle: "Default Title",
      price: product.price,
    });
  }

  return (
    <div className="collections-page">
      <div className="hero">
        <h1>{collection.name}</h1>
        <p>{collection.description}</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.isNew && <span className="product-badge badge-new">New</span>}
              {product.isLimited && <span className="product-badge badge-limited">Limited</span>}
              {product.isMembersOnly && <span className="product-badge badge-vip">VIP</span>}
              {"\u{1F36B}"}
            </div>
            <div className="product-info">
              <div className="product-category">{product.category}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-desc">{product.description}</div>

              {product.tastingNotes.primaryFlavors.length > 0 && (
                <div className="product-flavors">
                  {product.tastingNotes.primaryFlavors.slice(0, 3).map((f) => (
                    <span key={f} className="flavor-tag">{f}</span>
                  ))}
                </div>
              )}

              <div className="product-footer">
                <span className="product-price">{formatPrice(product.price)}</span>
                <div className="product-actions">
                  <Link href={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                    Details
                  </Link>
                  {product.isPreOrder ? (
                    <Link href={`/pre-orders`} className="btn btn-primary">
                      Pre-Order
                    </Link>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/collections" className="btn btn-secondary">
          All Collections
        </Link>
      </div>
    </div>
  );
}
