"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface GiftDetails {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message?: string;
}

export interface CartItem {
  id: string;
  networkId: "mtn" | "airtel" | "glo" | "9mobile" | string;
  networkName: string;
  phoneNumber: string;
  amountNgn: number;
  amountUsd: number;
  isGift: boolean;
  giftDetails?: GiftDetails;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  totalUsd: number;
  totalNgn: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "bitbundle_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isMounted]);

  const addItem = (item: Omit<CartItem, "id" | "addedAt">) => {
    const newItem: CartItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      addedAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.length;
  const totalUsd = items.reduce((sum, item) => sum + item.amountUsd, 0);
  const totalNgn = items.reduce((sum, item) => sum + item.amountNgn, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        clearCart,
        itemCount,
        totalUsd,
        totalNgn,
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
