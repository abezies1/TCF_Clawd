"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { persistCart, getPersistedCart, clearPersistedCart } from "@/lib/storage";
import { selectionFeedback } from "@/lib/native/haptics";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const persisted = getPersistedCart();
    if (persisted.length > 0) {
      setItems(
        persisted.map((item) => ({
          variantId: item.variantId,
          productId: item.productId,
          name: item.name,
          variantTitle: item.variantTitle,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))
      );
    }
    setInitialized(true);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (initialized) {
      persistCart(items);
    }
  }, [items, initialized]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    selectionFeedback();
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(variantId);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    clearPersistedCart();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
