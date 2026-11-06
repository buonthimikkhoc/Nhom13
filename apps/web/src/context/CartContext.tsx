"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Cart } from "../types";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const res = await api.getCart();
      if (res.success) {
        setCart(res.data);
      }
    } catch (e) {
      console.error("Lỗi khi tải giỏ hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      const res = await api.addToCart(variantId, quantity);
      if (res.success) {
        setCart(res.data);
      } else {
        alert(res.error?.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (e: any) {
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.success) {
        setCart(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await api.removeCartItem(itemId);
      if (res.success) {
        setCart(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.clearCart();
      setCart({ id: "cart-local", items: [] });
    } catch (e) {
      console.error("Lỗi khi làm trống giỏ hàng:", e);
      setCart({ id: "cart-local", items: [] });
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount =
    cart?.items?.reduce((sum, item) => sum + item.quantity * item.variant.price, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        totalAmount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

