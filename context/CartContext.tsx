"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string | number; // This is the CartItem DB id if from DB, or a local id if local
  productId: string;
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
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            const formatted = data.map((d: any) => ({
              id: d.id, // the cart item ID
              productId: d.productId,
              title: d.product.title,
              designer: d.product.brand,
              size: d.size || undefined,
              image: d.product.images[0]?.url || "/placeholder.jpg",
              duration: "4 Days", // Default for now
              deposit: d.product.securityDeposit,
              price: d.product.rentalPrice,
              startDate: d.startDate ? new Date(d.startDate).toISOString() : undefined,
              endDate: d.endDate ? new Date(d.endDate).toISOString() : undefined,
            }));
            setCartItems(formatted);
          }
        } catch (e) {
          console.error("Failed to load DB cart", e);
        }
      } else if (status === "unauthenticated") {
        const stored = localStorage.getItem('cart');
        if (stored) {
          try {
            setCartItems(JSON.parse(stored));
          } catch (e) {}
        }
      }
      if (status !== "loading") setIsLoaded(true);
    };
    loadCart();
  }, [status]);

  useEffect(() => {
    if (isLoaded && status === "unauthenticated") {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded, status]);

  const addToCart = async (item: CartItem) => {
    // Determine the product ID to use (if it's a local item, item.id is actually the product id)
    const pId = item.productId || item.id as string;
    
    // Add locally for optimistic UI
    const tempId = Date.now().toString();
    const tempItem = { ...item, id: tempId, productId: pId };
    setCartItems(prev => [...prev, tempItem]);

    if (status === "authenticated") {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            productId: pId,
            size: item.size,
            startDate: item.startDate,
            endDate: item.endDate
          })
        });
        if (res.ok) {
          const dbItem = await res.json();
          // Update temp ID with real DB ID
          setCartItems(prev => prev.map(i => i.id === tempId ? { ...i, id: dbItem.id } : i));
        }
      } catch (e) {
        console.error("Failed to add to DB cart", e);
      }
    }
  };

  const removeFromCart = async (id: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    
    if (status === "authenticated") {
      try {
        await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to delete from DB cart", e);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (status === "authenticated") {
      try {
        await fetch(`/api/cart`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to clear DB cart", e);
      }
    }
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
