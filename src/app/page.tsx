import { getProducts, getCollections, isShopifyConfigured } from "@/lib/shopify";
import { products as fallbackProducts } from "@/lib/products";
import MenuContent from "@/components/MenuContent";
import FallbackMenu from "@/components/FallbackMenu";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  if (!isShopifyConfigured()) {
    return <FallbackMenu products={fallbackProducts} />;
  }

  try {
    const [products, collections] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);

    if (products.length === 0) {
      console.warn("Shopify returned 0 products, falling back to local menu");
      return <FallbackMenu products={fallbackProducts} />;
    }

    return <MenuContent products={products} collections={collections} />;
  } catch (error) {
    console.error("Failed to fetch from Shopify:", error);
    return <FallbackMenu products={fallbackProducts} />;
  }
}
