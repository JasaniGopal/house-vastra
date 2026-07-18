"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface WishlistItem {
  id: string | number;
  brand: string;
  name: string;
  rentalPrice: string;
  retailPrice: string;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initially
  useEffect(() => {
    const loadWishlist = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data = await res.json();
            const formatted = data.map((d: any) => ({
              id: d.productId,
              brand: d.product.brand,
              name: d.product.title,
              rentalPrice: d.product.rentalPrice.toString(),
              retailPrice: d.product.retailPrice.toString(),
              image: d.product.images[0]?.url || "/placeholder.jpg"
            }));
            setWishlistItems(formatted);
          }
        } catch (e) {
          console.error("Failed to load DB wishlist", e);
        }
      } else if (status === "unauthenticated") {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          try {
            setWishlistItems(JSON.parse(stored));
          } catch (e) {}
        }
      }
      if (status !== "loading") setIsLoaded(true);
    };
    loadWishlist();
  }, [status]);

  // Sync to localstorage if unauthenticated
  useEffect(() => {
    if (isLoaded && status === "unauthenticated") {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
    if (isLoaded) {
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  }, [wishlistItems, isLoaded, status]);

  const toggleWishlist = async (item: WishlistItem) => {
    // Optimistic UI update
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });

    if (status === "authenticated") {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id })
        });
      } catch (e) {
        console.error("Failed to sync wishlist toggle", e);
      }
    }
  };

  const addToWishlist = async (item: WishlistItem) => {
    const exists = wishlistItems.find(i => i.id === item.id);
    if (!exists) {
      await toggleWishlist(item);
    }
  };

  const removeFromWishlist = async (id: string | number) => {
    const exists = wishlistItems.find(i => i.id === id);
    if (exists) {
      await toggleWishlist(exists);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (status === "authenticated") {
      // API currently doesn't have a bulk delete, but this handles local state
      // Can be added later if needed
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
