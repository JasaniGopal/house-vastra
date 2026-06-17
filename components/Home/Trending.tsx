"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { wishlistItems, toggleWishlist: contextToggleWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?trending=true");
        if (res.ok) {
          const data = await res.json();
          // Map backend data to frontend structure expected by wishlist/ui
          const mapped = data.slice(0, 8).map((p: any) => ({
            id: p.id,
            title: p.name,
            price: `₹${p.rentalPrice4Day?.toLocaleString() || "0"}`,
            image: p.images?.[0]?.url || "/images/placeholder.jpg",
            link: `/product/${p.id}`,
            alt: p.name,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch trending products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    contextToggleWishlist({
      id: product.id,
      brand: "House of Vastra", // Default since it's not mapped from API initially in Trending
      name: product.title,
      rentalPrice: product.price.replace("₹", "").replace(",", ""),
      retailPrice: "0",
      image: product.image
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#fcf9f8] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        
        {/* Section Header with Carousel Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight">
              Trending <span className="font-light italic">Now</span>
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-[#1c1b1b] hover:border-[#775a19] hover:text-[#775a19] active:scale-95 transition-all duration-300"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-[#1c1b1b] hover:border-[#775a19] hover:text-[#775a19] active:scale-95 transition-all duration-300"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Carousel Wrapper */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center py-20 text-zinc-500 font-serif">
              Loading latest trends...
            </div>
          ) : products.length === 0 ? (
            <div className="w-full flex items-center justify-center py-20 text-zinc-500 font-serif">
              New arrivals coming soon.
            </div>
          ) : (
            products.map((product, idx) => (
            <Link
              key={idx}
              href={product.link}
              className="group relative flex-none w-[85%] sm:w-[45%] md:w-[31.5%] lg:w-[31.5%] snap-start snap-always"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#FAF2E8]">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Wishlist Button Overlay */}
                <button
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm text-zinc-700 hover:scale-105 active:scale-90 transition-all duration-300"
                  aria-label="Toggle wishlist"
                >
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      wishlistItems.some(i => i.id === product.id) ? "fill-red-500 text-red-500" : "text-zinc-700"
                    }`}
                    fill={wishlistItems.some(i => i.id === product.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Info Area */}
              <div className="flex flex-col flex-1 p-4 pb-5">
                <h3 className="font-serif text-base md:text-lg text-[#001410] leading-snug mb-3">
                  {product.title}
                </h3>
                
                <div className="mt-auto flex items-end justify-between">
                  <div className="font-serif text-lg md:text-xl font-medium text-[#001410]">
                    {product.price}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold text-[#A8813C] uppercase tracking-wider md:hidden border-b border-[#A8813C] pb-0.5">
                    Rent Now
                  </div>
                </div>
              </div>
            </Link>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
