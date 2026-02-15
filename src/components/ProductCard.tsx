"use client";

import Image from "next/image";
import { ShopifyProduct, formatShopifyPrice } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { impactFeedback } from "@/lib/native/haptics";

export default function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();

  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  if (!firstVariant) return null;

  async function handleAddToCart() {
    await impactFeedback("LIGHT");
    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      name: product.title,
      variantTitle: firstVariant.title,
      price: parseFloat(firstVariant.price.amount),
      image: firstImage?.url,
    });
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            width={400}
            height={300}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : (
          "\u{1F36B}"
        )}
      </div>
      <div className="product-info">
        {product.productType && (
          <div className="product-category">{product.productType}</div>
        )}
        <div className="product-name">{product.title}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <span className="product-price">{formatShopifyPrice(price)}</span>
          <button
            className="btn btn-primary"
            disabled={!firstVariant.availableForSale}
            onClick={handleAddToCart}
          >
            {firstVariant.availableForSale ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
