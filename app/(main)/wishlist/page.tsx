"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface WishlistItem {
  designer: string;
  title: string;
  price: string;
  duration: string;
  image: string;
  link: string;
  alt: string;
}

const mockWishlist: WishlistItem[] = [
  {
    designer: "SABYASACHI HERITAGE",
    title: "Emerald Zari Lehenga",
    price: "₹12,500",
    duration: "/ 4 days",
    image: "/images/home/why-rent-vastra-home.jpg",
    link: "/product/emerald-lehenga",
    alt: "Emerald Zari Lehenga",
  },
  {
    designer: "MANISH MALHOTRA",
    title: "Ivory Gold Sherwani",
    price: "₹15,000",
    duration: "/ 4 days",
    image: "/images/home/bag_gold_sherwani.png",
    link: "/product/ivory-sherwani",
    alt: "Ivory Gold Sherwani",
  },
  {
    designer: "ANITA DONGRE",
    title: "Royal Blue Banarasi",
    price: "₹8,000",
    duration: "/ 4 days",
    image: "/images/home/trending-home-3.jpg",
    link: "/product/royal-blue",
    alt: "Royal Blue Banarasi",
  },
  {
    designer: "THE HERITAGE COLLECTION",
    title: "Curated Designer Ensemble",
    price: "₹10,000",
    duration: "/ 4 days",
    image: "/images/home/hero_home_image_mobile.jpg", 
    link: "/product/heritage",
    alt: "Heritage Collection",
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
          const parsed = JSON.parse(saved);
          setItems(parsed);
        } else {
          // Initialize local storage with our beautifully curated mock data 
          // so the user gets to see the design instantly if they haven't used the site yet.
          setItems(mockWishlist);
          localStorage.setItem("wishlist", JSON.stringify(mockWishlist));
        }
      } catch (e) {
        setItems(mockWishlist);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
    
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const removeItem = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    const updated = items.filter(i => i.title !== title);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-sans">Loading wishlist...</div>;
  }

  return (
    <div className="mx-auto max-w-[1280px] w-full px-4 md:px-16 py-8 md:py-12 bg-[#fcf9f8] min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-[#001410] tracking-tight">Favourites</h1>
        <p className="font-sans text-[#414846] text-sm md:text-base">
          A curated collection of your most coveted ethnic pieces.
        </p>
        
        <div className="flex items-center gap-2 mt-4 text-[#775a19] text-sm font-medium font-sans cursor-pointer hover:opacity-80 transition-opacity w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
          </svg>
          Sort by: Recently Added
        </div>
      </div>
      
      <hr className="border-[#c1c8c5]/40 mb-8" />

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-16 h-16 text-[#c1c8c5] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h2 className="font-serif text-xl font-medium text-[#001410] mb-2">Your wishlist is empty</h2>
          <p className="font-sans text-zinc-500 mb-6 max-w-sm">Explore our curated collections and save your favorite pieces here.</p>
          <Link href="/" className="bg-[#001410] text-white px-6 py-3 rounded text-sm font-bold tracking-wider uppercase hover:bg-[#00261f] transition-colors">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {items.map((item, idx) => (
            <Link 
              href={item.link} 
              key={`${item.title}-${idx}`}
              className="group block break-inside-avoid relative"
            >
              {/* Image Frame */}
              <div className="relative w-full overflow-hidden bg-[#FAF2E8] rounded-sm">
                <img 
                  src={item.image} 
                  alt={item.alt}
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Remove Icon Overlay */}
                <button 
                  onClick={(e) => removeItem(e, item.title)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm text-red-500 hover:scale-105 active:scale-90 transition-all duration-300 z-10"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                {/* Conditional "NOTIFY ME" overlay simulating the screenshot's state */}
                {item.title === "Royal Blue Banarasi" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-all">
                    <span className="bg-white text-[#001410] px-4 py-2.5 font-sans text-xs font-bold tracking-[0.15em] uppercase">
                      Notify Me
                    </span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="mt-4 text-left pb-2">
                <span className="block text-[10px] md:text-xs font-sans text-zinc-500 font-semibold uppercase tracking-wider">
                  {item.designer}
                </span>
                <h3 className="font-serif text-[15px] md:text-base font-medium text-[#001410] mt-1 group-hover:text-[#775a19] transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <div className="mt-1.5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 text-sm md:text-base">
                  <span className="font-sans text-zinc-600 text-xs md:text-[13px]">Starting from</span>
                  <span className="font-sans font-bold tracking-tight text-[#001410]">{item.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
