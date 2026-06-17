"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string | number;
  title: string;
  designer: string;
  size?: string;
  image: string;
  duration: string;
  deposit: number;
  price: number;
  startDate?: string;
  endDate?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Don't add if exact same item is already in bag
      const exists = prev.find(i => i.id === item.id && i.size === item.size);
      if (exists) return prev; 
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string | number) => {
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
