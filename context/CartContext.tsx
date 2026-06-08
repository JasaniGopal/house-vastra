"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  title: string;
  designer: string;
  size?: string;
  image: string;
  duration: string;
  deposit: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Start with empty cart, or mock data? 
  // We'll use the mock data you previously had on checkout so the UI isn't completely empty when reloading.
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 9991,
      title: "Midnight Velvet Lehenga",
      designer: "Sabyasachi Heritage Collection",
      image: "/images/home/bag_midnight_lehenga.png",
      duration: "4 Days: 12 Oct - 16 Oct",
      deposit: 5000,
      price: 12499,
    },
    {
      id: 9992,
      title: "Champagne Gold Sherwani",
      designer: "Manish Malhotra",
      size: "Size M",
      image: "/images/home/bag_gold_sherwani.png",
      duration: "4 Days: 14 Oct - 18 Oct",
      deposit: 3500,
      price: 8999,
    },
  ]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Don't add if exact same item is already in bag
      const exists = prev.find(i => i.id === item.id && i.size === item.size);
      if (exists) return prev; 
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
