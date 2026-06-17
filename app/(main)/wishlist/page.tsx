"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRemove = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    removeFromWishlist(id);
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    addToCart({
      id: item.id,
      title: item.name,
      designer: item.brand,
      image: item.image,
      duration: "4 Days",
      deposit: parseInt(item.rentalPrice.replace(/,/g, '')) * 0.2, // Mock 20% deposit
      price: parseInt(item.rentalPrice.replace(/,/g, ''))
    });
    showToast(`${item.name} added to your bag!`);
  };

  return (
    <div className="mx-auto max-w-[1280px] w-full px-4 md:px-16 py-8 md:py-12 bg-[#fcf9f8] min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-[#001410] tracking-tight">Favourites</h1>
        <p className="font-sans text-[#414846] text-sm md:text-base">
          A curated collection of your most coveted ethnic pieces.
        </p>
        
        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-[#775a19] text-sm font-medium font-sans cursor-pointer hover:opacity-80 transition-opacity w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
            Sort by: Recently Added
          </div>
        )}
      </div>
      
      <hr className="border-[#c1c8c5]/40 mb-8" />

      {/* Grid or Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center bg-white border border-zinc-200 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-[#f5efe6] rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#001410] mb-3">Your wishlist is empty</h2>
          <p className="font-sans text-zinc-500 mb-8 max-w-sm">Explore our curated collections and save your favorite pieces here for your next big event.</p>
          <Link href="/collections" className="bg-[#001410] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase hover:bg-[#775a19] transition-colors">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item, idx) => (
            <Link 
              href={`/product/${item.id}`} 
              key={`${item.id}-${idx}`}
              className="group flex flex-col gap-3 relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Remove Icon Overlay */}
                <button 
                  onClick={(e) => handleRemove(e, item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-red-500 hover:scale-110 active:scale-90 transition-all duration-300 z-10"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col flex-1 pb-2">
                <h3 className="font-serif text-sm md:text-base text-[#001410] leading-snug mb-3">
                  {item.name}
                </h3>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <div className="font-serif text-base md:text-lg font-medium text-[#001410]">₹{item.rentalPrice}</div>
                    <div className="text-[10px] md:text-xs text-zinc-500 mt-0.5">Retail: ₹{item.retailPrice}</div>
                  </div>
                </div>
                
                {/* Add to Bag Action */}
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  className="mt-4 w-full border border-[#001410] text-[#001410] hover:bg-[#001410] hover:text-white py-2.5 text-xs font-sans font-bold tracking-[0.1em] uppercase transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className="bg-[#001410] text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 border border-[#775a19]/30">
            <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="font-sans text-xs md:text-[13px] uppercase font-bold tracking-wider">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
