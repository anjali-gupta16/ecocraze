import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, Product, BulkTier } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'ecocraze_cart';

function getEffectivePrice(product: Product, qty: number): { price: number; label: string } {
  if (!product.bulk_pricing || product.bulk_pricing.length === 0) {
    return { price: product.price, label: 'Standard' };
  }

  const sorted = [...product.bulk_pricing].sort((a, b) => a.min_qty - b.min_qty);
  let matched = sorted[0];

  for (const tier of sorted) {
    if (qty >= tier.min_qty) {
      matched = tier;
    }
  }

  const maxQty = matched.max_qty ? `${matched.max_qty}` : '+';
  return {
    price: matched.unit_price,
    label: `${matched.min_qty}–${maxQty} packets`,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const { price, label } = getEffectivePrice(product, newQty);
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: newQty, unit_price: price, tier_label: label }
            : i
        );
      }
      const { price, label } = getEffectivePrice(product, quantity);
      return [...prev, { product, quantity, unit_price: price, tier_label: label }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const { price, label } = getEffectivePrice(i.product, quantity);
        return { ...i, quantity, unit_price: price, tier_label: label };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const totalSavings = items.reduce(
    (sum, i) => sum + (i.product.price - i.unit_price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, totalSavings }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
