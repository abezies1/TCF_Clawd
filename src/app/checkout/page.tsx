"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createCheckout } from "@/lib/shopify";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    async function redirect() {
      try {
        const lineItems = items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }));
        const { webUrl } = await createCheckout(lineItems);
        clearCart();
        window.location.href = webUrl;
      } catch {
        router.push("/cart");
      }
    }

    redirect();
  }, [items, clearCart, router]);

  return (
    <div style={{ textAlign: "center", padding: 64 }}>
      <p>Redirecting to secure checkout...</p>
    </div>
  );
}
