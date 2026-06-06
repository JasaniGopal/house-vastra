"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const trendingProducts = [
  {
    designer: "Sabyasachi Mukherjee",
    title: "Blush Pink Floral Lehenga",
    price: "₹8,500",
    duration: "/ 4 days",
    image: "/images/home/trending-home-2.jpg",
    link: "/product/pink-lehenga",
    alt: "Blush pink designer floral lehenga by Sabyasachi",
  },
  {
    designer: "Anita Dongre",
    title: "Maroon Velvet Sherwani",
    price: "₹12,000",
    duration: "/ 4 days",
    image: "/images/home/product_patola_sherwani.jpg",
    link: "/product/maroon-sherwani",
    alt: "Premium maroon velvet wedding sherwani by Anita Dongre",
  },
  {
    designer: "Manish Malhotra",
    title: "Ivory Silk Drape Saree",
    price: "₹6,200",
    duration: "/ 4 days",
    image: "/images/home/trending-home-3.jpg",
    link: "/product/ivory-saree",
    alt: "Ivory silk drape saree with sequined details by Manish Malhotra",
  },
  {
    designer: "Sabyasachi Mukherjee",
    title: "Emerald Banarasi Lehenga",
    price: "₹9,500",
    duration: "/ 4 days",
    image: "/images/home/hero_home_image_mobile.jpg",
    link: "/product/emerald-lehenga",
    alt: "Emerald banarasi heritage lehenga by Sabyasachi",
  },
  {
    designer: "Anita Dongre",
    title: "Classic Patola Sherwani",
    price: "₹10,500",
    duration: "/ 4 days",
    image: "/images/home/product_patola_sherwani.jpg",
    link: "/product/classic-patola-sherwani",
    alt: "Traditional patola weave wedding sherwani",
  },
];

export default function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
          const parsed = JSON.parse(saved);
          const map: Record<string, boolean> = {};
          parsed.forEach((item: any) => {
            map[item.title] = true;
          });
          setWishlisted(map);
        } else {
          setWishlisted({});
        }
      } catch (e) {
        console.error("Failed to load wishlist", e);
      }
    };
    
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const toggleWishlist = (e: React.MouseEvent, product: typeof trendingProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlisted((prev) => {
      const isCurrentlyWishlisted = !!prev[product.title];
      const newState = { ...prev, [product.title]: !isCurrentlyWishlisted };
      
      try {
        const saved = localStorage.getItem("wishlist");
        let items: any[] = [];
        if (saved) items = JSON.parse(saved);
        
        if (!isCurrentlyWishlisted) {
          if (!items.find((i) => i.title === product.title)) {
            items.push(product);
          }
        } else {
          items = items.filter((i) => i.title !== product.title);
        }
        
        localStorage.setItem("wishlist", JSON.stringify(items));
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        console.error("Failed to update wishlist", err);
      }
      
      return newState;
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
          {trendingProducts.map((product, idx) => (
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
                      wishlisted[product.title] ? "fill-red-500 text-red-500" : "text-zinc-700"
                    }`}
                    fill={wishlisted[product.title] ? "currentColor" : "none"}
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
              <div className="flex flex-col text-left">
                {/* Designer Label */}
                <span className="text-[10px] md:text-xs font-sans text-zinc-400 mt-3 font-semibold uppercase tracking-wider">
                  {product.designer}
                </span>

                {/* Product Title */}
                <h3 className="font-serif text-base md:text-lg font-semibold text-[#001410] mt-1 line-clamp-1 group-hover:text-[#775a19] transition-colors duration-300">
                  {product.title}
                </h3>

                {/* Pricing Details */}
                <div className="flex items-baseline gap-1 mt-1.5 font-serif text-base md:text-lg font-bold text-[#001410]">
                  <span>{product.price}</span>
                  <span className="text-xs md:text-sm font-sans font-normal text-zinc-500 tracking-wide">
                    {product.duration}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
