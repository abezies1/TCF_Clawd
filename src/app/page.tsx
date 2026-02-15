import { getProducts, getCollections, isShopifyConfigured } from "@/lib/shopify";
import { products as fallbackProducts } from "@/lib/products";
import MenuContent from "@/components/MenuContent";
import FallbackMenu from "@/components/FallbackMenu";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  console.log("[DEBUG] isShopifyConfigured:", isShopifyConfigured());
  console.log("[DEBUG] DOMAIN:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  console.log("[DEBUG] TOKEN:", process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "SET" : "NOT SET");

  if (!isShopifyConfigured()) {
    console.log("[DEBUG] Shopify not configured, using fallback");
    return <FallbackMenu products={fallbackProducts} />;
  }

  try {
    console.log("[DEBUG] Fetching from Shopify...");
    const [products, collections] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);

    console.log("[DEBUG] Got", products.length, "products from Shopify");

    if (products.length === 0) {
      console.warn("Shopify returned 0 products, falling back to local menu");
      return <FallbackMenu products={fallbackProducts} />;
    }

    return <MenuContent products={products} collections={collections} />;
  } catch (error) {
    console.error("[DEBUG] Failed to fetch from Shopify:", error);
    return <FallbackMenu products={fallbackProducts} />;
  }
}
