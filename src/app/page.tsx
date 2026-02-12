import { getProducts, getCollections, isShopifyConfigured } from "@/lib/shopify";
import { products as fallbackProducts } from "@/lib/products";
import MenuContent from "@/components/MenuContent";
import FallbackMenu from "@/components/FallbackMenu";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  if (!isShopifyConfigured()) {
    return <FallbackMenu products={fallbackProducts} />;
  }

  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return <MenuContent products={products} collections={collections} />;
}
