"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Product Data
const MOCK_PRODUCTS = [
  {
    id: 1,
    brand: "SABYASACHI HERITAGE",
    name: "Emerald Banarasi Heritage Lehenga",
    rentalPrice: "14,500",
    retailPrice: "4,20,000",
    image: "/images/home/why-rent-vastra-home.jpg"
  },
  {
    id: 2,
    brand: "MANISH MALHOTRA",
    name: "Nocturnal Sequin Cocktail Saree",
    rentalPrice: "8,500",
    retailPrice: "1,85,000",
    image: "/images/home/trending-home-2.jpg"
  },
  {
    id: 3,
    brand: "ANITA DONGRE",
    name: "Ivory Silk Hand-Embroidered Sherwani",
    rentalPrice: "12,000",
    retailPrice: "2,40,000",
    image: "/images/home/product_patola_sherwani.jpg"
  },
  {
    id: 4,
    brand: "RAW MANGO",
    name: "Rani Gota Patti Silk Saree",
    rentalPrice: "5,500",
    retailPrice: "85,000",
    image: "/images/home/trending-home-3.jpg"
  },
  {
    id: 5,
    brand: "MANISH MALHOTRA",
    name: "Midnight Velvet Zardosi Sherwani",
    rentalPrice: "24,000",
    retailPrice: "4,50,000",
    image: "/images/home/bag_gold_sherwani.png"
  },
  {
    id: 6,
    brand: "RAW MANGO",
    name: "Ruby Kanjeevaram Classic Saree",
    rentalPrice: "9,500",
    retailPrice: "1,10,000",
    image: "/images/home/occassion_weddings.png"
  },
  {
    id: 7,
    brand: "RITU KUMAR",
    name: "Botanical Hand-Painted Anarkali",
    rentalPrice: "14,800",
    retailPrice: "1,80,000",
    image: "/images/home/bag_midnight_lehenga.png"
  },
  {
    id: 8,
    brand: "TARUN TAHILIANI",
    name: "Rose Crystal Couture Lehenga",
    rentalPrice: "32,000",
    retailPrice: "5,50,000",
    image: "/images/home/occassion_cocktail.png"
  }
];

// Reusable Product Card Component
const ProductCard = ({ product }: { product: typeof MOCK_PRODUCTS[0] }) => {
  return (
    <Link href="#" className="group flex flex-col gap-3 relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/70 backdrop-blur-md rounded-xl flex items-center justify-center text-[#001410] hover:bg-white hover:text-red-500 transition-colors shadow-sm">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-[#A8813C] uppercase mb-1">{product.brand}</span>
        <h3 className="font-serif text-base md:text-lg text-[#001410] leading-snug mb-3 pr-4">{product.name}</h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="font-serif text-lg md:text-xl font-medium text-[#001410]">₹{product.rentalPrice}</div>
            <div className="text-[10px] md:text-xs text-zinc-500 mt-0.5">Retail: ₹{product.retailPrice}</div>
          </div>
          {/* Action text changes based on breakpoint to match design */}
          <div className="text-[10px] md:text-xs font-bold text-[#A8813C] uppercase tracking-wider md:hidden border-b border-[#A8813C] pb-0.5">Rent Now</div>
          <div className="text-[10px] md:text-[11px] font-medium text-zinc-500 hidden md:block">Rental / 4 Days</div>
        </div>
      </div>
    </Link>
  );
};

export default function CollectionsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Lehengas']);
  const [selectedSize, setSelectedSize] = useState<string>('S');

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleSize = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      
      {/* Top Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-8 border-b border-zinc-200/60">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center md:text-left text-[#001410] mb-4 md:mb-6 tracking-tight leading-tight">Explore <br className="hidden md:block lg:hidden" />Collections</h1>
        <p className="text-sm md:text-base text-zinc-600 max-w-[600px] text-center md:text-left mx-auto md:mx-0 leading-relaxed">
          Curated heritage pieces from India's most prestigious couturiers, available for your next defining moment. Experience luxury that transcends ownership.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* --- MOBILE: Horizontal Pill Filters --- */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Category
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <button className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Size
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <button className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Price
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">84 Pieces Found</span>
            <div className="relative flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#001410] uppercase tracking-wider">Sort By</span>
              <select defaultValue="New Arrivals" className="bg-transparent border-none text-[10px] font-bold text-[#001410] uppercase tracking-wider focus:ring-0 appearance-none pr-4">
                <option value="New Arrivals">New Arrivals</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <svg className="w-3 h-3 text-[#001410] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- DESKTOP: Sticky Left Sidebar Filters --- */}
        <div className="hidden md:flex flex-col w-[240px] shrink-0 gap-10 sticky top-24 h-fit">
          
          {/* Sort By Dropdown */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Sort By</span>
            <div className="relative">
               <select defaultValue="New Arrivals" className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer">
                 <option value="New Arrivals">New Arrivals</option>
                 <option value="Price: Low to High">Price: Low to High</option>
                 <option value="Price: High to Low">Price: High to Low</option>
               </select>
               <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Category</span>
            <div className="flex flex-col gap-3">
              {['Lehengas', 'Sarees', 'Sherwanis', 'Anarkalis'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-zinc-300 text-[#001410] focus:ring-[#775a19]"
                  />
                  <span className="text-xs text-zinc-600 group-hover:text-[#001410] transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Size</span>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-10 border text-xs transition-colors ${
                    selectedSize === size 
                      ? 'border-[#001410] bg-[#001410] font-bold text-white' 
                      : 'border-zinc-200 bg-white font-medium text-zinc-600 hover:border-[#001410] hover:text-[#001410]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Price Range Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Daily Price Range</span>
            <div className="mt-4 relative">
               {/* Visual Range Slider Mock */}
               <div className="h-1 w-full bg-zinc-200 rounded-full relative">
                  <div className="absolute left-[10%] right-[30%] h-full bg-[#001410] rounded-full"></div>
                  <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#001410] shadow flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#001410] shadow flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
               </div>
               <div className="flex justify-between items-center mt-4 text-[10px] font-bold text-zinc-500">
                 <span>₹2,000</span>
                 <span>₹50,000+</span>
               </div>
            </div>
          </div>

        </div>

        {/* --- Product Grid --- */}
        <div className="flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination/Load More */}
          <div className="mt-16 flex justify-center">
             <button className="border border-[#001410] text-[#001410] px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#001410] hover:text-white transition-colors">
                Load More Pieces
             </button>
          </div>
        </div>

      </div>
    </main>
  );
}
